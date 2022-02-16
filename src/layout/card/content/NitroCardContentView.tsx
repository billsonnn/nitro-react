import { FC, useMemo } from 'react';
import { Column } from '../../../common/Column';
import { useNitroCardContext } from '../context';
import { NitroCardContentViewProps } from './NitroCardContextView.types';

export const NitroCardContentView: FC<NitroCardContentViewProps> = props =>
{
    const { theme = 'primary', classNames = [], ...rest } = props;
    const { simple = false } = useNitroCardContext();

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'container-fluid', 'content-area' ];

        if(simple) newClassNames.push('simple');

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ simple, classNames ]);

    return <Column classNames={ getClassNames } overflow="auto" { ...rest } />;
}
