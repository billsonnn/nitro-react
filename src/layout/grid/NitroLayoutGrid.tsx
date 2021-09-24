import { FC, useMemo } from 'react';
import { NitroLayoutBase } from '../base';
import { NitroLayoutGridProps } from './NitroLayoutGrid.types';

export const NitroLayoutGrid: FC<NitroLayoutGridProps> = props =>
{
    const { className = '', gap = 3, ...rest } = props;

    const getClassName = useMemo(() =>
    {
        let newClassName = 'grid h-100';

        if(className && className.length) newClassName += ' ' + className;

        return newClassName;
    }, [ className ]);

    return <NitroLayoutBase className={ getClassName } gap={ gap } { ...rest }  />;
}
