import './PlayingCard.css'

export enum CardSuit {
    Spades,
    Clubs,
    Hearts,
    Diamonds
}

interface Card {
    suit: CardSuit,
    text: String
}

function PlayingCard({ suit, text }: Card) {
    let cardColor = "red";
    let cardEmoji = "🐰";
    switch (suit) {
        case CardSuit.Clubs:
            cardEmoji = "♣";
            cardColor = "black";
            break;
        case CardSuit.Spades:
            cardEmoji = "♠";
            cardColor = "black";
            break;
        case CardSuit.Diamonds:
            cardEmoji = "♦";
            cardColor = "red";
            break;
        case CardSuit.Hearts:
            cardEmoji = "♥";
            cardColor = "red";
            break;
    }
    const cardClasses = `card suit-${cardColor}`
    const backdropClass = `card-backdrop-${cardColor} layer-sibling`
    return (
        <>
            <div className={cardClasses}>
                <div className="card-header">
                    <span>{text}</span>
                    <span>{cardEmoji}</span>
                </div>
                <div className='card-center'>
                    <span className={backdropClass}></span>
                    <div className='value-parent layer-sibling'>
                        <span className='card-value'>10</span>
                    </div>
                </div>
                <div className="card-footer">
                    <span>{cardEmoji}</span>
                    <span>{text}</span>
                </div>
            </div>
        </>
    )
}

export default PlayingCard