import { ForwardedRef, forwardRef, useImperativeHandle, useRef, useState } from 'react';
import './SidePanel.css';
import Stopwatch, { StopwatchHandle } from './stopwatch/Stopwatch';
import { Variant } from '../../shared/variants';
import { useKeyPress } from '../../hooks/useKeyPress';
import PauseModal from './pause-modal/PauseModal';

export interface SidePanelProps {
    showAutoSolve: boolean,
    activeVariant: Variant,
    newGameClicked: () => void,
    undoClicked: () => void,
    autoSolveClicked: () => void,
    variantSelected: (variant: Variant) => void,
    restartClicked: () => void
}

export interface SidePanelHandles {
    setTimerPaused: (isPaused: boolean) => void,
    resetTimer: () => void,
}

const SidePanel = forwardRef(function SidePanel({ showAutoSolve, activeVariant, newGameClicked, undoClicked, autoSolveClicked, variantSelected, restartClicked }: SidePanelProps, ref: ForwardedRef<unknown>) {
    const stopwatchRef = useRef<StopwatchHandle>(null);
    const [gamePaused, setGamePaused] = useState(false);

    useImperativeHandle(ref, () => {
        return {
            setTimerPaused(isPaused: boolean) {
                stopwatchRef.current?.setPaused(isPaused);
            },
            resetTimer() {
                stopwatchRef.current?.reset();
            }
        }
    });

    const onOptionSelected = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const cardGameVariant: Variant = Variant[event.target.value as keyof typeof Variant];
        variantSelected(cardGameVariant);
    };

    const pauseGame = () => {
        setGamePaused(true);
        stopwatchRef.current?.setPaused(true);
    };

    const unpauseGame = () => {
        setGamePaused(false);
        stopwatchRef.current?.setPaused(false);
    };

    useKeyPress({ keys: [{ key: ' ' }], callback: (_) => gamePaused ? unpauseGame() : pauseGame() });

    return (
        <div id='side-panel'>
            <div className='side-column'>
                <div className='button-column'>
                    <div className='card-game-group'>
                        <label>Card Game</label>
                        <select className='panel-dropdown' onChange={onOptionSelected} value={activeVariant}>
                            {Object.keys(Variant).map(variant => <option key={variant}>{variant}</option>)}
                        </select>
                    </div>
                    <button onClick={newGameClicked} className='panel-button'>New Game</button>
                    <button onClick={restartClicked} className='panel-button'>Restart Game</button>
                    <button onClick={pauseGame} className='panel-button'>Pause Game</button>
                    <button onClick={undoClicked} className='panel-button'>Undo Move</button>
                </div>
                <div className='special-column'>
                    {showAutoSolve ? <button onClick={autoSolveClicked} className='panel-button glow-button'>Auto-Solve</button> : undefined}
                    <Stopwatch ref={stopwatchRef}></Stopwatch>
                </div>
            </div>
            {gamePaused ? <PauseModal resumeGameClicked={unpauseGame}></PauseModal> : undefined}
        </div>
    )
});

export default SidePanel;