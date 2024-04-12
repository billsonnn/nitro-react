import { DetailedHTMLProps, forwardRef, HTMLAttributes, PropsWithChildren } from 'react';
import { classNames } from '../../common';

export const ToolbarItemView = forwardRef<HTMLDivElement, PropsWithChildren<{
    icon: string;
}> & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>>((props, ref) =>
{
    const { icon = null, className = null, ...rest } = props;

    return (
        <div
            ref={ ref }
            className={ classNames(
                'cursor-pointer',
                `nitro-icon icon-${ icon }`,
                className
            ) }
            { ...rest } />
    );
});

ToolbarItemView.displayName = 'ToolbarItemView';
