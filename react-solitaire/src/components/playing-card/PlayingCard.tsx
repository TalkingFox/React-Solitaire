import './PlayingCard.css'
import { CardSuit } from '../../shared/enums'
import { CARD_VALUE_BY_TEXT, doSuitsAlternate } from '../../shared/card-values'
import PlayingCardSmall from './playing-card-small/PlayingCardSmall'
import PlayingCardStandard from './playing-card-standard/PlayingCardStandard'

export enum CardSource {
    CardColumn,
    DrawPile,
    CardStack,
    FreeStack,
    Reserve
}

export enum CardSize {
    Small,
    Standard
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
    cardSize?: CardSize
}

export const FacesByText = new Map([
    ['A', 'Ace'],
    ['J', 'Jack'],
    ['Q', 'Queen'],
    ['K', 'King']
])

export function ChildrenAreInDescendingOrderWithAlternatingSuits(parent: CardProps, children: CardProps[]): boolean {
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


function PlayingCard(props: CardProps) {
    switch (props.cardSize ?? CardSize.Standard) {
        case CardSize.Small:
            return <PlayingCardSmall
                source={props.source}
                suit={props.suit}
                text={props.text}
                children={props.children}
                isFaceDown={props.isFaceDown}
                isDraggable={props.isDraggable}
                onClick={props.onClick}
                onRightClick={props.onRightClick}
                zIndex={props.zIndex}
            >
            </PlayingCardSmall>
        case CardSize.Standard:
            return <PlayingCardStandard
                source={props.source}
                suit={props.suit}
                text={props.text}
                children={props.children}
                isFaceDown={props.isFaceDown}
                isDraggable={props.isDraggable}
                onClick={props.onClick}
                onRightClick={props.onRightClick}
                zIndex={props.zIndex}
            ></PlayingCardStandard>
    }
}

export default PlayingCard