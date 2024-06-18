import { DetailedHTMLProps, forwardRef, InputHTMLAttributes, PropsWithChildren } from 'react';
import { classNames } from './classNames';

const classes = {
    base: 'block w-full placeholder-gray-400 border border-gray-300 shadow-sm appearance-none',
    disabled: '',
    size: {
        default: 'px-2 py-2  font-medium',
    },
    rounded: 'rounded-md',
    color: {
        default: 'focus:outline-none focus:ring-indigo-500 focus:border-indigo-500',
    }
};

export const NitroInput = forwardRef<HTMLInputElement, PropsWithChildren<{
    color?: 'default' | 'dark' | 'ghost';
    inputSize?: 'xs' | 'sm' | 'default' | 'lg' | 'xl';
    rounded?: boolean;
}> & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>>((props, ref) =>
{
    const { color = 'default', inputSize = 'default', rounded = true, disabled = false, type = 'text', autoComplete = 'off', className = null, ...rest } = props;

    return (
        <input
            ref={ ref }
            autoComplete={ autoComplete }
            className={ classNames(
                classes.base,
                classes.size[inputSize],
                rounded && classes.rounded,
                classes.color[color],
                disabled && classes.disabled,
                className
            ) }
            disabled={ disabled }
            type={ type }
            { ...rest } />
    );
});

NitroInput.displayName = 'NitroInput';
