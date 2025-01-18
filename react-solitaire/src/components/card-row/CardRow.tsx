import PlayingCard, { CardProps, CardSource } from '../playing-card/PlayingCard';
import './CardRow.css';

export interface CardRowProps {
    cards: CardProps[],
    allVisible?: boolean
}

const CardRow = ({ cards, allVisible = true }: CardRowProps) => {
    const renderElements: JSX.Element[] = [];

    const emptyRow = (
        <div className='card-row-card card'>
            <div className='empty-stack' key={crypto.randomUUID()}>                <div className='empty-stack-row'>
                <span>♠</span>
                <span>♥</span>
            </div>
                <div className='empty-stack-row'>
                    <span>♣</span>
                    <span>♦</span>
                </div>
            </div>
        </div>
    );
    renderElements.push(emptyRow);

    cards.forEach((card, index) => {
        const cardElement = (
            <div className='card-row-card'
                style={{ marginLeft: `${1.5 * index}rem` }}>
                <PlayingCard
                    key={crypto.randomUUID()}
                    source={CardSource.Reserve}
                    suit={card.suit}
                    text={card.text}
                    isDraggable={!card.isFaceDown}
                    isFaceDown={allVisible ? false : index != cards.length-1}
                    zIndex={index}
                ></PlayingCard>
            </div>)
        renderElements.push(cardElement);
    });

    return (
        <div className='card-row'>
            {renderElements}
        </div>
    )
};

export default CardRow;