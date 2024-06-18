import { FC, useMemo } from 'react';
import { Column, ColumnProps } from '..';

export const NitroCardContentView: FC<ColumnProps> = props =>
{
    const { overflow = 'auto', classNames = [], ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        // Theme Changer
        const newClassNames: string[] = [ 'container-fluid', 'h-full p-[8px] overflow-auto', 'bg-light' ];

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ classNames ]);

    return <Column classNames={ getClassNames } overflow={ overflow } { ...rest } />;
};
