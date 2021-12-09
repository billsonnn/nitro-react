import { FC, useMemo } from 'react';
import { Base, BaseProps } from './Base';
import { ColorVariantType } from './types/ColorVariantType';
import { FontSizeType } from './types/FontSizeType';
import { FontWeightType } from './types/FontWeightType';

export interface TextProps extends BaseProps<HTMLDivElement>
{
    variant?: ColorVariantType;
    fontWeight?: FontWeightType;
    fontSize?: FontSizeType;
    underline?: boolean;
    truncate?: boolean;
    center?: boolean;
}

export const Text: FC<TextProps> = props =>
{
    const { variant = 'black', fontWeight = null, fontSize = 0, underline = false, truncate = false, center = false, ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'd-inline' ];

        if(variant) newClassNames.push('text-' + variant);

        if(fontWeight) newClassNames.push('fw-' + fontWeight);

        if(fontSize) newClassNames.push('fs-' + fontSize);

        if(underline) newClassNames.push('text-decoration-underline');

        if(truncate) newClassNames.push('text-truncate');

        if(center) newClassNames.push('text-center');

        return newClassNames;
    }, [ variant, fontWeight, fontSize, underline, truncate, center ]);

    return <Base classNames={ getClassNames } { ...rest } />;
}
