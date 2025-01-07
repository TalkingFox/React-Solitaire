import { CardSuit } from "../../shared/enums"
import PlayingCard, { CardProps, CardSource } from "../playing-card/PlayingCard";
import './DeckStack.css'
import DrawPile from "./draw-pile/DrawPile";

export interface DeckStackProps {
    deck: CardProps[],
    playedCards: CardProps[],
    drawCardsClicked: () => void,
    cardRightClicked: (card: CardProps) => void
}

function DeckStack({ deck, playedCards, drawCardsClicked, cardRightClicked }: DeckStackProps) {
    let deckElement: JSX.Element;
    if (deck.length > 0) {
        deckElement = <PlayingCard
            suit={CardSuit.Hearts}
            text="A"
            isFaceDown={true}
            onClick={drawCardsClicked}
            source={CardSource.DrawPile}
        />
    }
    else {
        deckElement = <div className="card deck" onClick={drawCardsClicked}>
            <div className="deck-outline">
                <div className="deck-ring"></div>
            </div>
        </div>
    }

    return (
        <div className="deck-stack">
            {deckElement}
            <DrawPile playedCards={playedCards.slice(-3)} cardRightClicked={cardRightClicked}></DrawPile>
        </div>
    )
}

export default DeckStack;