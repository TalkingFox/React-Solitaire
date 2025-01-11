import { useEffect, useRef } from 'react';
import PlayingCard, { CardProps, CardSource } from '../playing-card/PlayingCard';
import './FreeStack.css';
import invariant from 'tiny-invariant';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

export interface FreeStackProps {
    card: CardProps | null,
    onCardDropped: (card: CardProps) => void
}

function FreeStack({ card, onCardDropped }: FreeStackProps) {
    const ref = useRef(null);
    useEffect(() => {
        const el = ref.current;
        invariant(el);

        return dropTargetForElements({
            element: el,
            onDrop: ({ source }) => {
                if (card) {
                    return;
                }
                const droppedCard = (source.data as unknown) as CardProps;
                onCardDropped(droppedCard);
            }
        });
    });

    let cardElement: (JSX.Element | undefined) = undefined;
    if (card) {
        cardElement = <PlayingCard suit={card.suit} source={CardSource.FreeStack} text={card.text} isFaceDown={false}></PlayingCard>
    }


    return (
        <div ref={ref} className='card free-stack'>
            <div className='free-stack-inner'>
                {cardElement}
            </div>
        </div>
    )
}

export default FreeStack;