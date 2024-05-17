import { FC, useMemo } from 'react';
import { Flex, FlexProps } from './Flex';
import { ButtonSizeType, ColorVariantType } from './types';

export interface ButtonProps extends FlexProps
{
    variant?: ColorVariantType;
    size?: ButtonSizeType;
    active?: boolean;
    disabled?: boolean;
}

export const Button: FC<ButtonProps> = props =>
{
    const { variant = 'primary', size = 'sm', active = false, disabled = false, classNames = [], ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = ['btn'];

        if (variant)
        {
            newClassNames.push('bg-' + variant);
            newClassNames.push('border-' + variant);

            if (variant == 'primary')
            {
                newClassNames.push('text-white');
                newClassNames.push('[box-shadow:inset_0_2px_#ffffff26,_inset_0_-2px_#0000001a,_0_1px_#0000001a]');
            }


            if (variant == 'success')
            {
                newClassNames.push('text-white');
                newClassNames.push('[box-shadow:inset_0_2px_#ffffff26,_inset_0_-2px_#0000001a,_0_1px_#0000001a]');
            }



        }


        if (size)
        {
            if (size == 'sm')
            {
                newClassNames.push('px-[.5rem] py-[.25rem] rounded-[.2rem]');
            }
        }

        if (active) newClassNames.push('active');

        if (disabled) newClassNames.push('pointer-events-none opacity-[.65] [box-shadow:none]');

        if (classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [variant, size, active, disabled, classNames]);

    return <Flex center classNames={getClassNames} {...rest} />;
}
