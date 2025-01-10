import './App.css'
import Klondike from '../components/klondike/Klondike.tsx';
import { useState } from 'react';
import { Variant } from '../shared/variants.ts';

function App() {
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
            cardGameElement = <div>No Freecell yet :(</div>
            break;
    }

    return (
        cardGameElement
    )
}

export default App
