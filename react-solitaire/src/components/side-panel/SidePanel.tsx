import { ForwardedRef, forwardRef, useImperativeHandle, useRef } from 'react';
import './SidePanel.css';
import Stopwatch, { StopwatchHandle } from './stopwatch/Stopwatch';

export interface SidePanelProps {
    showAutoSolve: boolean,
    newGameClicked: () => void,
    undoClicked: () => void,
    autoSolveClicked: () => void
}

export interface SidePanelHandles {
    setTimerPaused: (isPaused: boolean) => void,
    resetTimer: () => void,
}

const SidePanel = forwardRef(function SidePanel({ showAutoSolve, newGameClicked, undoClicked, autoSolveClicked }: SidePanelProps, ref: ForwardedRef<unknown>) {
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

    return (
        <div id='side-panel'>
            <div className='side-column'>
                <div className='button-column'>
                    <button onClick={newGameClicked} className='panel-button'>New Game</button>
                    <button onClick={undoClicked} className='panel-button'>Undo Move</button>
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