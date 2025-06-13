import { useState, useEffect, useRef } from "react";

/**
 * useStateWithCallback
 * 在 setState 完成后执行回调的 Hook
 */
export default function useStateWithCallback<T>(
    initialValue: T
): [T, (value: T, callback?: (val: T) => void) => void] {
    const [state, setState] = useState<T>(initialValue);
    const callbackRef = useRef<((val: T) => void) | null>(null);

    useEffect(() => {
        if (callbackRef.current) {
            callbackRef.current(state);
            callbackRef.current = null;
        }
    }, [state]);

    const setStateWithCallback = (newValue: T, callback?: (val: T) => void) => {
        callbackRef.current = callback ?? null;
        setState(newValue);
    };

    return [state, setStateWithCallback];
}
