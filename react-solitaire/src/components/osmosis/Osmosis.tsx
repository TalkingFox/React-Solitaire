import { useMemo, useState } from "react";
import CardRow from "../card-row/CardRow";
import DeckStack from "../deck-stack/DeckStack";
import { CardProps, CardSource } from "../playing-card/PlayingCard";
import { DeckBuilder } from "../../shared/deck-builder";

interface OsmosisStateHistory {
    drawDeck?: CardProps[],
    drawPile?: CardProps[],
    reserves?: CardProps[][],
    cardStacks?: CardProps[][]
}

function buildReserves(startingDeck: CardProps[]): CardProps[][] {
    const reserves: CardProps[][] = [[], [], [], []];
    for (let i = 0; i < reserves.length; i++) {
        const reserve = reserves[i];
        for (let j = 0; j < 4; j++) {
            const popCard = startingDeck.pop();
            if (!popCard) {
                continue
            }
            popCard.source = CardSource.Reserve;
        }
        reserve[reserve.length - 1].isFaceDown = false;
    }
    return reserves;
}

const Osmosis = () => {
    const startingDeck = useMemo(DeckBuilder.BuildDeck, []);
    const startingReserves = useMemo<CardProps[][]>(() => buildReserves(startingDeck), []);
    const startingCard = startingDeck.pop() as CardProps;

    const [reserves, setReserves] = useState<CardProps[][]>(startingReserves);
    const [cardStacks, setCardStacks] = useState<CardProps[][]>([[startingCard], [], [], []]);
    const [drawDeck, setDrawDeck] = useState<CardProps[]>(startingDeck.slice(0));
    const [drawPile, setDrawPile] = useState<CardProps[]>([]);
    const [undoStack, setUndoStack] = useState<OsmosisStateHistory[]>([{
        reserves: reserves.map((res) => res.map(r => structuredClone(r))),
        cardStacks: cardStacks.map((stack) => stack.map(card => structuredClone(card))),
        drawDeck: drawDeck.map((card) => structuredClone(card)),
        drawPile: []
    }]);


    return (
        <>
            <div className="row">
                <CardRow></CardRow>
                <CardRow></CardRow>
                <DeckStack deck={drawDeck} playedCards={drawPile}></DeckStack>
            </div>
        </>
    )
}

export default Osmosis;