import { FC, useMemo } from 'react';
import { NitroLayoutGridProps } from './NitroLayoutGrid.types';

export const NitroLayoutGrid: FC<NitroLayoutGridProps> = props =>
{
    const { className = '', gap = 3, children = null, ...rest } = props;

    const getClassName = useMemo(() =>
    {
        let newClassName = 'grid h-100';

        if(gap >= 1) newClassName += ` gap-${ gap }`;

        if(className && className.length) newClassName += ' ' + className;

        return newClassName;
    }, [ className, gap ]);

    return (
        <div className={ getClassName } { ...rest }>
            { children }
        </div>
    );
}
