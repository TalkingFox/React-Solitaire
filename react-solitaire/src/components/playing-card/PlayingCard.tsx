import { Fragment, MouseEventHandler, RefObject, useRef } from 'react'
import CardCenter from './card-center/CardCenter'
import { GetSymbolAndColorFromSuit } from './CardSymbolGenerator'
import './PlayingCard.css'
import { useDraggable } from '../../hooks/useDraggable'
import { createPortal } from 'react-dom'
import { previewStyles } from '../../shared/style'
import { CardSuit } from '../../shared/enums'
import { CARD_VALUE_BY_TEXT, doSuitsAlternate } from '../../shared/card-values'

export enum CardSource {
    CardColumn,
    DrawPile,
    CardStack,
    FreeStack
}

export interface CardProps {
    suit: CardSuit,
    text: string,
    isFaceDown?: boolean,
    isDraggable?: boolean,
    onClick?: () => void,
    onRightClick?: (prop: CardProps) => void,
    source: CardSource,
    zIndex?: number,
    children?: CardProps[],
    isDragging?: boolean
}

const facesByText = new Map([
    ['A', 'Ace'],
    ['J', 'Jack'],
    ['Q', 'Queen'],
    ['K', 'King']
])

function ChildrenAreInDescendingOrderWithAlternatingSuits(parent: CardProps, children: CardProps[]): boolean {
    const allElements = [parent].concat(children);
    for (let i = 0; i < allElements.length - 1; i++) {
        const parentElement = allElements[i];
        const childElement = allElements[i + 1];

        const parentValue = CARD_VALUE_BY_TEXT[parentElement.text];
        const childValue = CARD_VALUE_BY_TEXT[childElement.text];
        const areAlternating = doSuitsAlternate(parentElement.suit, childElement.suit);
        if (!areAlternating || ((parentValue - 1) != childValue)) {
            return false;
        }
    }
    return true;
}

function RenderFaceDownCard(onClick?: () => void) {
    return (
        <div className='card card-back' onClick={onClick}>
            <div className='card-back-border'>
                <div className='card-back-border-2'>
                    <div className='card-back-pattern-container'>
                        <div className='card-back-circle-outer'>
                            <div className='card-back-circle-inner-ring'>
                                <div className='card-back-circle-inner-solid'></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function PlayingCard({ suit, text, isFaceDown = false, onClick, isDraggable = true, onRightClick, source, zIndex, children = [], isDragging = false }: CardProps) {
    if (isFaceDown) {
        return RenderFaceDownCard(onClick);
    }
    const [cardSymbol, cardColor] = GetSymbolAndColorFromSuit(suit)
    let numberOfElements = Number(text);
    if (isNaN(numberOfElements)) {
        numberOfElements = 1
    }
    const cardClasses = `card suit-${cardColor}`
    const cardFace = facesByText.get(text) ?? ''

    const itemRef = useRef<HTMLDivElement>(null);

    if (isDraggable && children && children.length > 0) {
        isDraggable = ChildrenAreInDescendingOrderWithAlternatingSuits({ source: source, suit: suit, text: text }, children);
    }

    const { state, preview, previewElement } = useDraggable({
        element: itemRef,
        getInitialData: () => ({ suit, text, source, children }),
        getData: () => ({ suit, text, source, children }),
        canDrag: () => isDraggable,
        canDrop: () => false
    });

    const contextMenuEvent: MouseEventHandler = (event) => {
        event.preventDefault();
        if (children.length > 0) {
            return;
        }
        if (onRightClick) {
            onRightClick({ suit, text, source, children })
        }
    };

    const castPreview = previewElement as RefObject<HTMLDivElement>;
    let child: JSX.Element | undefined = undefined;
    let childPreview: JSX.Element | undefined = undefined;

    if (children.length > 0) {
        const grandChildren = children.slice(0);
        const childProps = grandChildren.shift() as CardProps;

        child = <PlayingCard
            suit={childProps.suit}
            text={childProps.text}
            children={grandChildren}
            source={childProps.source}
            isDraggable={!(childProps.isFaceDown ?? true)}
            isFaceDown={childProps.isFaceDown}
            onClick={onClick}
            onRightClick={onRightClick}
            zIndex={childProps.zIndex}
            isDragging={(state == 'dragging' || isDragging)}>
        </PlayingCard>

        childPreview = <PlayingCard
            suit={childProps.suit}
            text={childProps.text}
            children={grandChildren}
            source={childProps.source}
            zIndex={childProps.zIndex}>
        </PlayingCard>
    }

    return (
        <Fragment>
            <div className='card-parent'>
                <div className={cardClasses}
                    ref={itemRef}
                    style={{ opacity: (state == 'dragging' || isDragging) ? 0 : 1, zIndex: zIndex ?? 0 }}
                    onClick={onClick}
                    onContextMenu={contextMenuEvent}>
                    <div className="card-header">
                        <span>{text}</span>
                        <span>{cardSymbol}</span>
                    </div>
                    <CardCenter symbol={cardSymbol} numberOfElements={numberOfElements} face={cardFace} />
                    <div className="card-footer">
                        <span>{cardSymbol}</span>
                        <span>{text}</span>
                    </div>
                </div>
                {child}
            </div>

            {preview && createPortal(
                <div className='card-parent' ref={castPreview} style={previewStyles(preview) as React.CSSProperties}>
                    <div className={cardClasses} >
                        <div className="card-header">
                            <span>{text}</span>
                            <span>{cardSymbol}</span>
                        </div>
                        <CardCenter symbol={cardSymbol} numberOfElements={numberOfElements} face={cardFace} />
                        <div className="card-footer">
                            <span>{cardSymbol}</span>
                            <span>{text}</span>
                        </div>
                    </div>
                    {childPreview}
                </div>, document.body
            )}
        </Fragment>
    );
}

export default PlayingCard