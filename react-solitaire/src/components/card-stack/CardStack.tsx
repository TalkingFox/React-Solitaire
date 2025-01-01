import { useEffect, useRef } from 'react';
import PlayingCard, { CardProps, CardSource } from '../playing-card/PlayingCard';
import './CardStack.css'
import invariant from 'tiny-invariant';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

export interface CardStackProps {
    cards: CardProps[],
    onCardDropped: (card: CardProps) => void
}

function CardStack({ cards, onCardDropped }: CardStackProps) {
    const ref = useRef(null);
    useEffect(() => {
        const el = ref.current;
        invariant(el);

        return dropTargetForElements({
            element: el,
            onDrop: ({ source }) => {
                const card = (source.data as unknown) as CardProps;
                onCardDropped(card);
            }
        });
    });

    let displayCard: JSX.Element | null = null;
    if (cards.length > 0) {
        const card = cards[cards.length - 1]
        displayCard = <PlayingCard suit={card.suit} text={card.text} source={CardSource.CardStack}></PlayingCard>
    }
    return (
        <div className='card card-stack' ref={ref}>
            <div className="card-stack-inner">
                {displayCard}
            </div>
        </div>
    )
}

export default CardStack;