import PlayingCard, { CardProps } from '../../playing-card/PlayingCard';
import './DrawPile.css';

export interface DrawPileProps {
    playedCards: CardProps[]
}

function DrawPile({ playedCards }: DrawPileProps) {
    return (
        <div className='draw-pile'>
            {
                playedCards.map((card, index) => {
                    let className = `pile-card card-${index + 1}`;
                    return (
                        <div className={className} key={crypto.randomUUID()}>
                            <PlayingCard
                                suit={card.suit}
                                text={card.text}
                                isDraggable={index == (playedCards.length - 1) ? true : false}></PlayingCard>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default DrawPile;