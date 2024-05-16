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
            newClassNames.push('text-[#fff] bg-[#1e7295] border-[#1e7295] [box-shadow:inset_0_2px_#ffffff26,_inset_0_-2px_#0000001a,_0_1px_#0000001a]');
        }

        if (size)
        {

            newClassNames.push('px-[.5rem] py-[.25rem] text-[.7875rem] rounded-[.2rem]');
        }

        if (active) newClassNames.push('active');

        if (disabled) newClassNames.push('disabled');

        if (classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [variant, size, active, disabled, classNames]);

    return <Flex center classNames={getClassNames} {...rest} />;
}
