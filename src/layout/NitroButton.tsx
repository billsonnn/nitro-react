import { ButtonHTMLAttributes, DetailedHTMLProps, forwardRef, PropsWithChildren } from 'react';
import { classNames } from './classNames';

const classes = {
    base: 'inline-flex justify-center items-center gap-2 transition-[background-color] duration-300 transform tracking-wide rounded-md',
    disabled: '',
    size: {
        default: 'px-2 py-0.5  font-medium',
        lg: 'px-5 py-3 text-base font-medium',
        xl: 'px-6 py-3.5 text-base font-medium',
    },
    outline: {
        default: 'text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-800'
    },
    color: {
        default: 'bg-button-gradient-gray border border-gray-500',
    }
};

export const NitroButton = forwardRef<HTMLButtonElement, PropsWithChildren<{
    color?: 'default' | 'dark' | 'ghost';
    size?: 'default' | 'lg' | 'xl';
    outline?: boolean;
}> & DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>>((props, ref) =>
{
    const { color = 'default', size = 'default', outline = false, disabled = false, type = 'button', className = null, ...rest } = props;

    return (
        <button
            ref={ ref }
            className={ classNames(
                classes.base,
                classes.size[size],
                outline ? classes.outline[color] : classes.color[color],
                disabled && classes.disabled,
                className
            ) }
            disabled={ disabled }
            type={ type }
            { ...rest } />
    );
});

NitroButton.displayName = 'NitroButton';
