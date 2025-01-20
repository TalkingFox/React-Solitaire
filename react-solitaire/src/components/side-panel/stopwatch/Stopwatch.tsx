import './Stopwatch.css';

import { ForwardedRef, forwardRef, useImperativeHandle, useRef, useState } from "react";

export interface StopwatchHandle {
    setPaused: (isPaused: boolean) => void,
    reset: () => void
}

const Stopwatch = forwardRef(function Stopwatch({ }, ref: ForwardedRef<unknown>) {
    const [startTime, setStartTime] = useState(Date.now());
    const [now, setNow] = useState(Date.now());
    const [isRunning, setRunning] = useState(true);
    const intervalRef = useRef<number | null>(null);

    useImperativeHandle(ref, () => {
        return {
            setPaused(isPaused: boolean) {
                setRunning(!isPaused);
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                }
                if (!isPaused) {
                    const currentSpan = now - startTime;
                    const newNow = Date.now();
                    setStartTime(newNow - currentSpan);
                    setNow(newNow);
                }
            },
            reset() {
                setStartTime(Date.now());
            }
        }
    });

    if (intervalRef.current) {
        clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
        if (isRunning) {
            setNow(Date.now);
        }
    }, 250);

    let totalSeconds = Math.floor((now - startTime) / 1000);
    totalSeconds = (totalSeconds < 0) ? 0 : totalSeconds;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return (
        <div className="stopwatch-box">
            <span className="stopwatch-text">{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}</span>
        </div>
    )
});

export default Stopwatch;