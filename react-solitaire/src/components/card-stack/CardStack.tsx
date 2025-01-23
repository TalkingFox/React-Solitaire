import { useEffect, useRef } from 'react';
import PlayingCard, { CardProps, CardSize, CardSource } from '../playing-card/PlayingCard';
import './CardStack.css'
import invariant from 'tiny-invariant';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

export interface CardStackProps {
    cards: CardProps[],
    isDraggable: boolean,
    cardSize?: CardSize,
    onCardDropped: (card: CardProps) => void
}

function CardStack({ cards, isDraggable, cardSize = CardSize.Standard, onCardDropped }: CardStackProps) {
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

    let displayCards: JSX.Element[] = []
    if (cards.length == 0) {
        const emptyStack = (
            <div className='empty-stack' key={crypto.randomUUID()}>                <div className='empty-stack-row'>
                <span>♠</span>
                <span>♥</span>
            </div>
                <div className='empty-stack-row'>
                    <span>♣</span>
                    <span>♦</span>
                </div>
            </div>
        );
        displayCards.push(emptyStack);
    }
    if (cards.length > 0) {
        const topCard = cards[cards.length - 1];
        displayCards.push(<PlayingCard cardSize={cardSize} suit={topCard.suit} text={topCard.text} source={CardSource.CardStack} zIndex={1} isDraggable={isDraggable} key={crypto.randomUUID()}></PlayingCard>)
    }
    if (cards.length > 1) {
        const topCard = cards[cards.length - 2];
        displayCards.push(<PlayingCard cardSize={cardSize} suit={topCard.suit} text={topCard.text} source={CardSource.CardStack} zIndex={0} isDraggable={isDraggable} key={crypto.randomUUID()}></PlayingCard>)
    }
    const cardSizeClass = cardSize == CardSize.Standard ? 'card' : 'card-small';
    const stackClasses = `${cardSizeClass} card-stack`;
    return (
        <div className={stackClasses} ref={ref}>
            <div className="card-stack-inner">
                {displayCards}
            </div>
        </div>
    )
}

export default CardStack;