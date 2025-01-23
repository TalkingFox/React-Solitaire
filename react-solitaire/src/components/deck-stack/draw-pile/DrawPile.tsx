import PlayingCard, { CardProps, CardSize, CardSource } from '../../playing-card/PlayingCard';
import './DrawPile.css';

export interface DrawPileProps {
    playedCards: CardProps[],
    cardSize?: CardSize,
    cardRightClicked: (card: CardProps) => void
}

function DrawPile({ playedCards, cardSize = CardSize.Standard, cardRightClicked }: DrawPileProps) {
    
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
                                isDraggable={index == (playedCards.length - 1) ? true : false}
                                onRightClick={index == (playedCards.length - 1) ? cardRightClicked : undefined}
                                source={CardSource.DrawPile}
                                cardSize={cardSize}
                            >
                            </PlayingCard>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default DrawPile;