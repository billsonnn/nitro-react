import { FC, useMemo } from 'react';
import { NitroLayoutButtonProps } from './NitroLayoutButton.types';

export const NitroLayoutButton: FC<NitroLayoutButtonProps> = props =>
{
    const { className = '', variant = 'primary', size = null, children = null, ...rest } = props;

    const getClassName = useMemo(() =>
    {
        let newClassName = 'btn';

        if(variant && variant.length) newClassName += ` btn-${ variant }`;

        if(size && size.length) newClassName += ` btn-${ size }`;

        if(className && className.length) newClassName += ` ${ className }`;

        return newClassName;
    }, [ className, variant, size ]);

    return (
        <button type="button" className={ getClassName } { ...rest }>
            { children }
        </button>
    );
}
