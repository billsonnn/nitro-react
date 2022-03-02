import { CSSProperties, FC, useMemo } from 'react';
import { Base, BaseProps } from './Base';
import { ColorVariantType } from './types';

export interface HorizontalRuleProps extends BaseProps<HTMLDivElement>
{
    variant?: ColorVariantType;
    height?: number;
}

export const HorizontalRule: FC<HorizontalRuleProps> = props =>
{
    const { variant = 'black', height = 1, classNames = [], style = {}, ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [];

        if(variant) newClassNames.push('bg-' + variant);

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ variant, classNames ]);

    const getStyle = useMemo(() =>
    {
        let newStyle: CSSProperties = { display: 'list-item' };

        if(height > 0) newStyle.height = height;

        if(Object.keys(style).length) newStyle = { ...newStyle, ...style };

        return newStyle;
    }, [ height, style ]);

    return <Base classNames={ getClassNames } style={ getStyle } { ...rest } />;
}
