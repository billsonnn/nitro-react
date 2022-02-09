import { FC, useMemo } from 'react';
import { Base, BaseProps } from './Base';
import { ColorVariantType, FontSizeType, FontWeightType } from './types';

export interface TextProps extends BaseProps<HTMLDivElement>
{
    variant?: ColorVariantType;
    fontWeight?: FontWeightType;
    fontSize?: FontSizeType;
    bold?: boolean;
    underline?: boolean;
    italics?: boolean;
    truncate?: boolean;
    center?: boolean;
    textEnd?: boolean;
    small?: boolean;
}

export const Text: FC<TextProps> = props =>
{
    const { variant = 'black', fontWeight = null, fontSize = 0, bold = false, underline = false, italics = false, truncate = false, center = false, textEnd = false, small = false, ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'd-inline' ];

        if(variant) newClassNames.push('text-' + variant);

        if(bold) newClassNames.push('fw-bold');

        if(fontWeight) newClassNames.push('fw-' + fontWeight);

        if(fontSize) newClassNames.push('fs-' + fontSize);

        if(underline) newClassNames.push('text-decoration-underline');

        if(italics) newClassNames.push('fst-italic');

        if(truncate) newClassNames.push('text-truncate');

        if(center) newClassNames.push('text-center');

        if(textEnd) newClassNames.push('text-end');

        if(small) newClassNames.push('small');

        return newClassNames;
    }, [ variant, fontWeight, fontSize, bold, underline, italics, truncate, center, textEnd, small ]);

    return <Base classNames={ getClassNames } { ...rest } />;
}
