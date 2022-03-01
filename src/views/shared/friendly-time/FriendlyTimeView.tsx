import { FriendlyTime } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Base, BaseProps } from '../../../common';

interface FriendlyTimeViewProps extends BaseProps<HTMLDivElement>
{
    seconds: number;
    isShort?: boolean;
}

export const FriendlyTimeView: FC<FriendlyTimeViewProps> = props =>
{
    const { seconds = 0, isShort = false, children = null, ...rest } = props;
    const [ updateId, setUpdateId ] = useState(-1);

    const getStartSeconds = useMemo(() => (Math.round(new Date().getSeconds()) - seconds), [ seconds ]);

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

    return <Base { ...rest }>{ getFriendlyTime() }</Base>;
}
