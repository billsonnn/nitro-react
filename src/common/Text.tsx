import { FC, useMemo } from 'react';
import { Base, BaseProps } from './Base';
import { ColorVariantType } from './types/ColorVariantType';
import { FontWeightType } from './types/FontWeightType';

export interface TextProps extends BaseProps<HTMLDivElement>
{
    variant?: ColorVariantType;
    fontWeight?: FontWeightType;
    underline?: boolean;
    center?: boolean;
}

export const Text: FC<TextProps> = props =>
{
    const { variant = 'black', fontWeight = null, underline = false, center = false, ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'd-inline' ];

        if(variant) newClassNames.push('text-' + variant);

        if(fontWeight) newClassNames.push('fw-' + fontWeight);

        if(underline) newClassNames.push('text-decoration-underline');

        if(center) newClassNames.push('text-center');

        return newClassNames;
    }, [ variant, fontWeight, underline, center ]);

    return <Base classNames={ getClassNames } { ...rest } />;
}
