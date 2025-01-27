import { Fragment, MouseEventHandler, RefObject, useRef } from 'react'
import { GetSymbolAndColorFromSuit } from '../CardSymbolGenerator'
import './PlayingCardSmall.css'
import { useDraggable } from '../../../hooks/useDraggable'
import { createPortal } from 'react-dom'
import { previewStyles } from '../../../shared/style'
import { CardProps, ChildrenAreInDescendingOrderWithAlternatingSuits} from '../PlayingCard'

function RenderFaceDownCard(onClick?: () => void) {
    return (
        <div className='card-small card-back' onClick={onClick}>
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

function PlayingCardSmall({ suit, text, isFaceDown = false, onClick, isDraggable = true, onRightClick, source, zIndex, children = [], isDragging = false }: CardProps) {
    if (isFaceDown) {
        return RenderFaceDownCard(onClick);
    }

    const [cardSymbol, cardColor] = GetSymbolAndColorFromSuit(suit)
    const cardClasses = `card-small suit-${cardColor}`
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

        child = <PlayingCardSmall
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
        </PlayingCardSmall>

        childPreview = <PlayingCardSmall
            suit={childProps.suit}
            text={childProps.text}
            children={grandChildren}
            source={childProps.source}
            zIndex={childProps.zIndex}>
        </PlayingCardSmall>
    }

    return (
        <Fragment>
            <div className='card-parent'>
                <div className={cardClasses}
                    ref={itemRef}
                    style={{ opacity: (state == 'dragging' || isDragging) ? 0 : 1, zIndex: zIndex ?? 0 }}
                    onClick={onClick}
                    onContextMenu={contextMenuEvent}>
                    <div className="card-header-small">
                        <span>{text}</span>
                        <span>{cardSymbol}</span>
                    </div>
                    <div className='card-center-small card-center--centered'>
                        <span className='card-face-small'>{cardSymbol}</span>
                    </div>
                    <div className="card-footer-small">
                        <span>{cardSymbol}</span>
                        <span>{text}</span>
                    </div>
                </div>
                {child}
            </div>

            {preview && createPortal(
                <div className='card-parent' ref={castPreview} style={previewStyles(preview) as React.CSSProperties}>
                    <div className={cardClasses} >
                        <div className="card-header-small">
                            <span>{text}</span>
                            <span>{cardSymbol}</span>
                        </div>
                        <div className='card-center-small card-center--centered'>
                            <span className='card-face-small'>{cardSymbol}</span>
                        </div>
                        <div className="card-footer-small">
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

export default PlayingCardSmall