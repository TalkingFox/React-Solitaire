import { useEffect, useRef } from 'react';
import PlayingCard, { CardProps, CardSource } from '../playing-card/PlayingCard';
import './CardRow.css';
import invariant from 'tiny-invariant';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

export interface CardRowProps {
    cards: CardProps[],
    allVisible?: boolean,
    allowDragging?: boolean,
    onCardDropped?: (card: CardProps) => void,
    onCardRightClicked?: (card: CardProps) => void
}

const CardRow = ({ cards, allVisible = true, allowDragging = true, onCardDropped, onCardRightClicked }: CardRowProps) => {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        invariant(el);

        return dropTargetForElements({
            element: el,
            onDrop: ({ source }) => {
                if (onCardDropped) {
                    const card = (source.data as unknown) as CardProps;
                    onCardDropped(card);
                }
            }
        });
    });

    const renderElements: JSX.Element[] = [];

    const emptyRow = (
        <div className='card-row-card card' key={crypto.randomUUID()}>
            {
                onCardDropped ? (
                    <div className='empty-stack' >
                        <div className='empty-stack-row'>
                            <span>♠</span>
                            <span>♥</span>
                        </div>
                        <div className='empty-stack-row'>
                            <span>♣</span>
                            <span>♦</span>
                        </div>
                    </div>
                ) : undefined
            }
        </div>
    );
    renderElements.push(emptyRow);

    cards.forEach((card, index) => {
        const isCardFaceDown = allVisible ? false : index != cards.length - 1;
        const cardElement = (
            <div className='card-row-card'
                style={{ marginLeft: `${1.5 * index}rem` }}
                key={crypto.randomUUID()}>
                <PlayingCard
                    key={crypto.randomUUID()}
                    source={CardSource.Reserve}
                    suit={card.suit}
                    text={card.text}
                    isDraggable={allowDragging ? !isCardFaceDown : false}
                    isFaceDown={isCardFaceDown}
                    zIndex={index}
                    onRightClick={isCardFaceDown ? undefined : onCardRightClicked}
                ></PlayingCard>
            </div>)
        renderElements.push(cardElement);
    });

    return (
        <div className='card-row' ref={ref}>
            {renderElements}
        </div>
    )
};

export default CardRow;