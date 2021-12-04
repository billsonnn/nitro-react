import { FC, useMemo } from 'react';
import { Flex, FlexProps } from './Flex';
import { ButtonSizeType } from './types/ButtonSizeType';
import { ColorVariantType } from './types/ColorVariantType';

export interface ButtonProps extends FlexProps
{
    variant?: ColorVariantType;
    size?: ButtonSizeType;
}

export const Button: FC<ButtonProps> = props =>
{
    const { variant = 'primary', size = null, classNames = [], ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'btn' ];

        if(variant) newClassNames.push('btn-' + variant);

        if(size) newClassNames.push('btn-' + size);

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ variant, size, classNames ]);

    return <Flex center classNames={ getClassNames } { ...rest } />;
}
