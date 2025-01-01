import { Fragment, RefObject, useRef } from 'react'
import CardCenter from './card-center/CardCenter'
import { GetSymbolAndColorFromSuit } from './CardSymbolGenerator'
import './PlayingCard.css'
import { useDraggable } from '../../hooks/useDraggable'
import { createPortal } from 'react-dom'
import { previewStyles } from '../../shared/style'
import { CardSuit } from '../../shared/enums'

export interface CardProps {
    suit: CardSuit,
    text: string,
    isFaceDown?: boolean,
    isDraggable?: boolean,
    onClick?: () => void
}

const facesByText = new Map([
    ['A', 'Ace'],
    ['J', 'Jack'],
    ['Q', 'Queen'],
    ['K', 'King']
])

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

function PlayingCard({ suit, text, isFaceDown = false, onClick, isDraggable = true }: CardProps) {
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
    const { state, preview, previewElement } = useDraggable({
        element: itemRef,
        getInitialData: () => ({ suit, text }),
        getData: () => ({ suit, text }),
        canDrag: () => isDraggable,
        canDrop: () => false,
    });

    const castPreview = previewElement as RefObject<HTMLDivElement>;

    return (
        <Fragment>
            <div className={cardClasses}
                ref={itemRef}
                style={{ opacity: state == 'dragging' ? 0 : 1 }}
                onClick={onClick}>
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

            {preview && createPortal(
                <div className={cardClasses} ref={castPreview} style={previewStyles(preview) as React.CSSProperties} >
                    <div className="card-header">
                        <span>{text}</span>
                        <span>{cardSymbol}</span>
                    </div>
                    <CardCenter symbol={cardSymbol} numberOfElements={numberOfElements} face={cardFace} />
                    <div className="card-footer">
                        <span>{cardSymbol}</span>
                        <span>{text}</span>
                    </div>
                </div>, document.body
            )}
        </Fragment>
    );
}

export default PlayingCard