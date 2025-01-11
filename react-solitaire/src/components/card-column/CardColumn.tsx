import { CSSProperties, useEffect, useRef } from 'react';
import PlayingCard, { CardProps, CardSource } from '../playing-card/PlayingCard';
import './CardColumn.css'
import invariant from 'tiny-invariant';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { CARD_VALUE_BY_TEXT } from '../../shared/card-values';

export interface CardColumnProps {
    cards: CardProps[],
    cardRightClicked: (card: CardProps) => void,
    onCardDropped: (card: CardProps) => void;
}

function CardColumn({ cards = [], cardRightClicked, onCardDropped }: CardColumnProps) {
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

    // Merge all face-up cards into a single card with children
    let newCards: CardProps[] = cards;
    const startingIndex = cards.findIndex((card) => !(card.isFaceDown ?? true));
    if (startingIndex >= 0) {
        newCards = cards.slice(0, startingIndex);
        const parentCard = cards[startingIndex]
        parentCard.children = cards.slice(startingIndex + 1);
        newCards.push(parentCard);
    }

    return (
        <div className='card card-column' ref={ref}>
            <div className='card-column-ring'>
                <div className='card-column-card-container'>
                    {
                        newCards.map((card, index) => {
                            const className = `card-column-card`;
                            return (
                                <div
                                    className={className}
                                    key={crypto.randomUUID()}
                                    style={{ marginTop: `${1.5 * index}rem`, zIndex: index } as CSSProperties}>
                                    <PlayingCard
                                        suit={card.suit}
                                        text={card.text}
                                        isFaceDown={card.isFaceDown ?? true}
                                        isDraggable={!(card.isFaceDown ?? true)}
                                        onRightClick={(index == newCards.length - 1) ? cardRightClicked : undefined}
                                        source={CardSource.CardColumn}
                                        children={card.children}
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