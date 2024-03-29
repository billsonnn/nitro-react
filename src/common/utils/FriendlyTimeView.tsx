import { FC, useEffect, useMemo, useState } from 'react';
import { FriendlyTime } from '../../api';
import { Base, BaseProps } from '../Base';

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

    useEffect(() =>
    {
        const interval = setInterval(() => setUpdateId(prevValue => (prevValue + 1)), 10000);

        return () => clearInterval(interval);
    }, []);

    const value = (Math.round(new Date().getSeconds()) - getStartSeconds);

    return <Base { ...rest }>{ isShort ? FriendlyTime.shortFormat(value) : FriendlyTime.format(value) }</Base>;
}
