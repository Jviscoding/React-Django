
import { useRef } from 'react';


type DebounceReturnType = {
    initDebounce: (func: Function, wait: number, taskId: string) => void;
}

type TaskSyncType = {
    timeout: ReturnType<typeof setTimeout>
}


export default function Debounce(pendingStatus: Map<string, number>, setPendingStatus: React.Dispatch<React.SetStateAction<Map<string, number>>>): DebounceReturnType {
    const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map<string, ReturnType<typeof setTimeout>>());
    const pendingTaskIds = useRef<Map<string, number>>(new Map<string, number>());

    function initDebounce(func: Function, wait: number, key: string = 'default') {


        const existingTimer = timers.current.get(key);

        if (existingTimer) {
            clearTimeout(existingTimer);
        }

        const timer = setTimeout(() => {
            timers.current.delete(key);

            // when func executes, increment pending status
            func()

            // set pending count
            setPendingStatus(prev => {
                if (!prev) return prev


                let next = new Map(prev)
                next.set(key, (prev.get(key) ?? 0) + 1)
                return next

            })

        }, wait);

        timers.current.set(key, timer);
    }

    return {
        initDebounce,
    }

}