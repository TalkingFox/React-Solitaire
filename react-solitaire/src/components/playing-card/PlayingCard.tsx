import CardCenter from './card-center/CardCenter'
import { GetSymbolAndColorFromSuit } from './CardSymbolGenerator'
import './PlayingCard.css'

export enum CardSuit {
    Spades,
    Clubs,
    Hearts,
    Diamonds
}

interface Card {
    suit: CardSuit,
    text: string,
}

function PlayingCard({ suit, text }: Card) {
    const [cardSymbol, cardColor] = GetSymbolAndColorFromSuit(suit)
    let numberOfElements = Number(text);
    if (isNaN(numberOfElements)) {
        numberOfElements = 1
    }
    const cardClasses = `card suit-${cardColor}`
    return (
        <>
            <div className={cardClasses}>
                <div className="card-header">
                    <span>{text}</span>
                    <span>{cardSymbol}</span>
                </div>
                <CardCenter symbol={cardSymbol} numberOfElements={numberOfElements} />
                <div className="card-footer">
                    <span>{cardSymbol}</span>
                    <span>{text}</span>
                </div>
            </div>
        </>
    )
}

export default PlayingCard