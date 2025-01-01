import { useState } from "react";
import { CardSuit } from "../../shared/enums"
import PlayingCard, { CardProps } from "../playing-card/PlayingCard";
import './DeckStack.css'
import DrawPile from "./draw-pile/DrawPile";

export interface DeckStackProps {
    startingDeck: CardProps[]
}

function DeckStack({ startingDeck }: DeckStackProps) {

    const [deck, setDeck] = useState<CardProps[]>(startingDeck);
    const [playedCards, setPlayedCards] = useState<CardProps[]>([]);
    const [lastThreeCards, setLastThreeCards] = useState<CardProps[]>([]);

    const drawThree = () => {
        let newDeck: CardProps[];
        let newPile: CardProps[];
        if (deck.length == 0) {
            newDeck = playedCards.slice(0).reverse();
            newPile = [];
        }
        else {
            newDeck = deck.slice(0)
            newPile = playedCards.slice(0);
        }

        const poppedCards = [
            newDeck.pop(),
            newDeck.pop(),
            newDeck.pop()
        ].filter(x => x !== null && x !== undefined);
        newPile.push(...poppedCards);

        setDeck(newDeck);
        setPlayedCards(newPile);
        setLastThreeCards(
            newPile.slice(Math.max(newPile.length - 3, 0))
        );
    };

    let deckElement: JSX.Element;
    if (deck.length > 0) {
        deckElement = <PlayingCard
            suit={CardSuit.Hearts}
            text="A"
            isFaceDown={true}
            onClick={drawThree}
        />
    }
    else {
        deckElement = <div className="card deck" onClick={drawThree}>
            <div className="deck-outline">
                <div className="deck-ring"></div>
            </div>
        </div>
    }

    return (
        <div className="deck-stack">
            {deckElement}
            <DrawPile playedCards={lastThreeCards}></DrawPile>
        </div>
    )
}

export default DeckStack;