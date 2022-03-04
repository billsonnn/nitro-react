import { FC, useMemo } from 'react';
import { Column, ColumnProps } from '..';

export const NitroCardContentView: FC<ColumnProps> = props =>
{
    const { overflow = 'auto', classNames = [], ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'container-fluid', 'content-area' ];

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ classNames ]);

    return <Column classNames={ getClassNames } overflow={ overflow } { ...rest } />;
}
