import { useMemo, useState } from "react";
import { CardSuit } from "../../shared/enums"
import PlayingCard, { CardProps } from "../playing-card/PlayingCard";
import './DeckStack.css'
import DrawPile from "./draw-pile/DrawPile";

function DeckStack() {
    const startingDeck = useMemo(() => {
        const suits = [
            CardSuit.Clubs,
            CardSuit.Diamonds,
            CardSuit.Hearts,
            CardSuit.Spades
        ]
        const texts = [
            "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"
        ]

        const fullDeck = suits.flatMap(suit => {
            return texts.map(text => {
                let prop: CardProps = {
                    suit: suit,
                    text: text
                };
                return prop
            });
        });


        // shuffle deck
        for (let i = fullDeck.length - 1; i > 0; i--) {
            const shuffle = Math.floor(Math.random() * i);
            [fullDeck[i], fullDeck[shuffle]] = [fullDeck[shuffle], fullDeck[i]];
        }
        return fullDeck;
    }, []);

    const [deck, setDeck] = useState<CardProps[]>(startingDeck);
    const [playedCards, setPlayedCards] = useState<CardProps[]>([]);
    const [lastThreeCards, setLastThreeCards] = useState<CardProps[]>([]);

    const drawThree = () => {
        const newDeck = deck.slice(0)
        const newPlayedCards = playedCards.slice(0);

        const poppedCards = [
            newDeck.pop(),
            newDeck.pop(),
            newDeck.pop()
        ].filter(x => x !== null && x !== undefined);
        newPlayedCards.push(...poppedCards);

        setDeck(newDeck);
        setPlayedCards(newPlayedCards);
        setLastThreeCards(poppedCards);
    };

    return (
        <div className="deck-stack">
            <PlayingCard suit={CardSuit.Hearts} text="A" isFaceDown={true} onClick={drawThree} />
            <DrawPile playedCards={lastThreeCards}></DrawPile>
        </div>
    )
}

export default DeckStack;