import { CSSProperties } from 'react';
import PlayingCard, { CardProps, CardSource } from '../playing-card/PlayingCard';
import './CardColumn.css'

export interface CardColumnProps {
    cards: CardProps[],
    cardRightClicked: (card: CardProps) => void
}

function CardColumn({ cards = [], cardRightClicked }: CardColumnProps) {
    return (
        <div className='card card-column'>
            <div className='card-column-ring'>
                <div className='card-column-card-container'>
                    {
                        cards.map((card, index) => {
                            const className = `card-column-card`;
                            const isFaceDown = index == cards.length - 1 ? false : true;
                            return (
                                <div
                                    className={className}
                                    key={crypto.randomUUID()}
                                    style={{ marginTop: `${1.5 * index}rem`, zIndex: index } as CSSProperties}>
                                    <PlayingCard
                                        suit={card.suit}
                                        text={card.text}
                                        isFaceDown={isFaceDown}
                                        isDraggable={!isFaceDown}
                                        onRightClick={(index == cards.length - 1) ? cardRightClicked : undefined}
                                        source={CardSource.CardColumn}
                                    >
                                    </PlayingCard>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div >
    )
}

export default CardColumn;