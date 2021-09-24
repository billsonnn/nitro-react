import { FC, useMemo } from 'react';
import { NitroLayoutFlexColumnProps } from './NitroLayoutFlexColumn.types';

export const NitroLayoutFlexColumn: FC<NitroLayoutFlexColumnProps> = props =>
{
    const { className = '', overflow = null, position = null, gap = null, children = null, ...rest } = props;

    const getClassName = useMemo(() =>
    {
        let newClassName = 'd-flex flex-column';

        if(overflow && overflow.length) newClassName += ` overflow-${ overflow }`;

        if(position && position.length) newClassName += ` position-${ position }`;

        if(gap && gap >= 1) newClassName += ` gap-${ gap }`;

        if(className && className.length) newClassName += ` ${ className }`;

        return newClassName;
    }, [ className, overflow, position, gap ]);

    return (
        <div className={ getClassName } { ...rest }>
            { children }
        </div>
    );
}
