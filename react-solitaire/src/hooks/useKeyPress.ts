import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

export enum KeyModifier {
    Control = "Control"
}

export interface KeyCombo {
    key: string,
    modifier: KeyModifier
}

export interface UseKeyPressProps {
    keys: KeyCombo[],
    callback: (event: KeyboardEvent) => void
}

export const useKeyPress = ({ keys, callback }: UseKeyPressProps) => {
    const callbackRef = useRef(callback);
    useLayoutEffect(() => {
        callbackRef.current = callback;
    });

    const handleKeyPress = useCallback((event: KeyboardEvent) => {
        const relevantKeyPressed = keys.some((key) => {
            if (key.key !== event.key) {
                return false;
            }
            return key.modifier ? event.getModifierState(key.modifier) : true;
        });
        if (relevantKeyPressed) {
            callbackRef.current(event);
        }
    }, [keys]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);

        return () => document.removeEventListener("keydown", handleKeyPress);
    }, [handleKeyPress]);
};