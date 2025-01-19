import './App.css'
import Klondike from '../components/klondike/Klondike.tsx';
import { useEffect, useState } from 'react';
import { Variant } from '../shared/variants.ts';
import Freecell from '../components/freecell/Freecell.tsx';
import Osmosis from '../components/osmosis/Osmosis.tsx';

function App() {
    useEffect(() => {
        document.body.addEventListener('dragover', (event) => {
            event.preventDefault();
        });
    });

    const [activeCardGame, setActiveCardGame] = useState(Variant.Klondike);

    const changeVariant = (variant: Variant) => {
        setActiveCardGame(variant);
    };

    let cardGameElement;
    switch (activeCardGame) {
        case Variant.Klondike:
            cardGameElement = <Klondike onVariantChanged={changeVariant}></Klondike>;
            break;
        case Variant.Freecell:
            cardGameElement = <Freecell onVariantChanged={changeVariant}></Freecell>
            break;
        case Variant.Osmosis:
            cardGameElement = <Osmosis onVariantChanged={changeVariant}></Osmosis>
            break;
    }

    return (
        cardGameElement
    )
}

export default App
