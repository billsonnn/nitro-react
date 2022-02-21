import { FC, useMemo } from 'react';
import { Column, ColumnProps } from '../../../common';
import { useNitroCardContext } from '../context';

export const NitroCardContentView: FC<ColumnProps> = props =>
{
    const { classNames = [], ...rest } = props;
    const { theme = 'primary', simple = false } = useNitroCardContext();

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'container-fluid', 'content-area' ];

        if(simple) newClassNames.push('simple');

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ simple, classNames ]);

    return <Column classNames={ getClassNames } overflow="auto" { ...rest } />;
}
