import { CardSuit } from "../../shared/enums"
import PlayingCard from "../playing-card/PlayingCard";
import './DeckStack.css'

function DeckStack() {
    const cards: JSX.Element[] = []

    const suits = [
        CardSuit.Clubs,
        CardSuit.Diamonds,
        CardSuit.Hearts,
        CardSuit.Spades
    ]
    const texts = [
        "A", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"
    ]

    return (
        <div className="deck-stack">
            <PlayingCard suit={CardSuit.Hearts} text="A" isFaceDown={true}/>
        </div>
    )
}

export default DeckStack;