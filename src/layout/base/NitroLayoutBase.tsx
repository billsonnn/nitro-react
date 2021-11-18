import { FC, useMemo } from 'react';
import { NitroLayoutBaseProps } from './NitroLayoutBase.types';

export const NitroLayoutBase: FC<NitroLayoutBaseProps> = props =>
{
    const { className = '', overflow = null, position = null, gap = null, ref = null, innerRef = null, children = null, ...rest } = props;

    const getClassName = useMemo(() =>
    {
        let newClassName = '';

        if(overflow && overflow.length) newClassName += ` overflow-${ overflow }`;

        if(position && position.length) newClassName += ` position-${ position }`;

        if(gap && gap >= 1) newClassName += ` gap-${ gap }`;

        if(className && className.length) newClassName += ` ${ className }`;

        return newClassName;
    }, [ className, overflow, position, gap ]);

    return (
        <div className={ getClassName } ref={ innerRef } { ...rest }>
            { children }
        </div>
    );
}
