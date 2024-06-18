import { useCallback, useMemo, useState } from 'react';

export const useSharedVisibility = () =>
{
    const [ activeIds, setActiveIds ] = useState<number[]>([]);

    const isVisible = useMemo(() => !!activeIds.length, [ activeIds ]);

    const activate = useCallback(() =>
    {
        let id = -1;

        setActiveIds(prevValue =>
        {
            const newValue = [ ...prevValue ];

            id = newValue.length ? (newValue[(newValue.length - 1)] + 1) : 0;

            newValue.push(id);

            return newValue;
        });

        return id;
    }, []);

    const deactivate = useCallback((id: number) =>
    {
        setActiveIds(prevValue =>
        {
            const newValue = [ ...prevValue ];

            const index = newValue.indexOf(id);

            if(index === -1) return prevValue;

            newValue.splice(index, 1);

            return newValue;
        });
    }, []);

    return { isVisible, activate, deactivate };
};
