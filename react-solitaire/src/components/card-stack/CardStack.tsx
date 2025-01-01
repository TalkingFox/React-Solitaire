import PlayingCard, { CardProps } from '../playing-card/PlayingCard';
import './CardStack.css'

export interface CardStackProps {
    cards: CardProps[]
}

function CardStack({ cards }: CardStackProps) {
    let displayCard: JSX.Element | null = null;
    if (cards.length > 0) {
        const card = cards[cards.length - 1]
        displayCard = <PlayingCard suit={card.suit} text={card.text}></PlayingCard>
    }
    return (
        <div className='card card-stack'>
            <div className="card-stack-inner">
                {displayCard}
            </div>
        </div>
    )
}

export default CardStack;