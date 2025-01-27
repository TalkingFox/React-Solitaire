import { CardSuit } from "../../shared/enums"
import PlayingCard, { CardProps, CardSize, CardSource } from "../playing-card/PlayingCard";
import './DeckStack.css'
import DrawPile from "./draw-pile/DrawPile";

export interface DeckStackProps {
    deck: CardProps[],
    playedCards: CardProps[],
    cardSize?: CardSize,
    drawCardsClicked: () => void,
    cardRightClicked: (card: CardProps) => void
}

function DeckStack({ deck, playedCards, cardSize = CardSize.Standard, drawCardsClicked, cardRightClicked }: DeckStackProps) {
    let deckElement: JSX.Element;
    if (deck.length > 0) {
        deckElement = <PlayingCard
            suit={CardSuit.Hearts}
            text="A"
            isFaceDown={true}
            onClick={drawCardsClicked}
            source={CardSource.DrawPile}
            cardSize={cardSize}
        />
    }
    else {
        const sizeClass = cardSize == CardSize.Standard ? 'card' : 'card-small';
        const className = `${sizeClass} deck`;
        deckElement = <div className={className} onClick={drawCardsClicked}>
            <div className="deck-outline">
                <div className="deck-ring"></div>
            </div>
        </div>
    }

    return (
        <div className="deck-stack">
            {deckElement}
            <DrawPile playedCards={playedCards.slice(-3)}
                cardRightClicked={cardRightClicked}
                cardSize={cardSize}
            ></DrawPile>
        </div>
    )
}

export default DeckStack;