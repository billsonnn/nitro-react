import { Dispatch, SetStateAction, useEffect, useState } from 'react';

const sharedStates: Map<string, any> = new Map();
const sharedSetters: Map<string, Dispatch<SetStateAction<any>>[]> = new Map();

export const useSharedState = <T>(key: string, initialValue?: T | (() => T)): [T, Dispatch<SetStateAction<T>>] =>
{
    const [ state, setState ] = useState<T>(() =>
    {
        try
        {
            const item = sharedStates.get(key);

            return item || initialValue;
        }
        
        catch (error)
        {
            console.error(error);

            return initialValue;
        }
    });
  
    const updateState: Dispatch<SetStateAction<T>> = data =>
    {
        try
        {
            const valueToStore = data instanceof Function ? data(state as T) : data;
            const setters = sharedSetters.get(key);

            if(setters) for(const setter of setters) setter(valueToStore);

            sharedStates.set(key, valueToStore);
        }
        
        catch (error)
        {
            console.error(error);
        }
    };

    useEffect(() =>
    {
        if(!key || !key.length) return;

        let existing = sharedSetters.get(key);

        if(!existing)
        {
            existing = [];

            sharedSetters.set(key, existing);
        }

        existing.push(setState);

        return () =>
        {
            const index = existing.findIndex(dispatch => (dispatch === setState));

            if(index >= 0) existing.splice(index, 1);
        }
    }, [ key ]);
    
    return [ state as T, updateState ];
}
