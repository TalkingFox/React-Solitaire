import { ForwardedRef, forwardRef, useImperativeHandle, useRef } from 'react';
import './SidePanel.css';
import Stopwatch, { StopwatchHandle } from './stopwatch/Stopwatch';
import { Variant } from '../../shared/variants';

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
                    <button onClick={undoClicked} className='panel-button'>Undo Move</button>
                    <button onClick={restartClicked} className='panel-button'>Restart Game</button>
                </div>
                <div className='special-column'>
                    {showAutoSolve ? <button onClick={autoSolveClicked} className='panel-button glow-button'>Auto-Solve</button> : undefined}
                    <Stopwatch ref={stopwatchRef}></Stopwatch>
                </div>
            </div>
        </div>
    )
});

export default SidePanel;