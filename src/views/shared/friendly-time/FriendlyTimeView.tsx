import { FriendlyTime } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { FriendlyTimeViewProps } from './FriendlyTimeView.types';

export const FriendlyTimeView: FC<FriendlyTimeViewProps> = props =>
{
    const { seconds = 0, isShort = false, ...rest } = props;
    const [ updateId, setUpdateId ] = useState(-1);

    const getStartSeconds = useMemo(() =>
    {
        return (Math.round(new Date().getSeconds()) - seconds);
    }, [ seconds ]);

    const getFriendlyTime = useCallback(() =>
    {
        const value = (Math.round(new Date().getSeconds()) - getStartSeconds);

        if(isShort) return FriendlyTime.format(value);

        return FriendlyTime.format(value);
    }, [ getStartSeconds, isShort ]);

    useEffect(() =>
    {
        const interval = setInterval(() => setUpdateId(prevValue => (prevValue + 1)), 10000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div { ...rest }>{ getFriendlyTime() }</div>
    );
}
