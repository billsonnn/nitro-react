import { NitroLogger } from '@nitrots/nitro-renderer';
import { Dispatch, SetStateAction, useState } from 'react';

const useLocalStorageState = <T>(key: string, initialValue: T): [ T, Dispatch<SetStateAction<T>>] =>
{
    const [ storedValue, setStoredValuie ] = useState<T>(() =>
    {
        if(typeof window === 'undefined') return initialValue;

        try
        {
            const item = window.localStorage.getItem(key);

            return item ? JSON.parse(item) : initialValue;
        }

        catch(error)
        {
            return initialValue;
        }
    });

    const setValue = (value: T) =>
    {
        try
        {
            const valueToStore = value instanceof Function ? value(storedValue) : value;

            setStoredValuie(valueToStore);

            if(typeof window !== 'undefined') window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }

        catch(error)
        {
            NitroLogger.error(error);
        }
    }

    return [ storedValue, setValue ];
}

export const useLocalStorage = useLocalStorageState;
