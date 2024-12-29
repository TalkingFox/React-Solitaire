import { DragEventHandler, Fragment, RefObject, useRef } from 'react'
import CardCenter from './card-center/CardCenter'
import { GetSymbolAndColorFromSuit } from './CardSymbolGenerator'
import './PlayingCard.css'
import { useDraggable } from '../../hooks/useDraggable'
import { createPortal } from 'react-dom'
import { previewStyles } from '../../shared/style'

export enum CardSuit {
    Spades,
    Clubs,
    Hearts,
    Diamonds
}

interface CardProps {
    suit: CardSuit,
    text: string,
}

const facesByText = new Map([
    ['A', 'Ace'],
    ['J', 'Jack'],
    ['Q', 'Queen'],
    ['K', 'King']
])

function PlayingCard({ suit, text }: CardProps) {
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
        canDrag: () => true,
        canDrop: () => true,
    });

    const castPreview = previewElement as RefObject<HTMLDivElement>;
    const onDragover: DragEventHandler = (event: React.DragEvent) => {
        event.preventDefault();
    }
    // addEventListener('dragover', (event) => {
    //     event.preventDefault();
    // });

    return (
        <Fragment>
            <div className={cardClasses} ref={itemRef} style={{opacity: state == 'dragging' ? 0 : 1}}>
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