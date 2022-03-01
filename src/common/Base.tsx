import { CSSProperties, DetailedHTMLProps, FC, HTMLAttributes, LegacyRef, useMemo } from 'react';
import { ColorVariantType, FloatType, OverflowType, PositionType } from './types';

export interface BaseProps<T = HTMLElement> extends DetailedHTMLProps<HTMLAttributes<T>, T>
{
    innerRef?: LegacyRef<T>;
    fit?: boolean;
    grow?: boolean;
    shrink?: boolean;
    fullWidth?: boolean;
    fullHeight?: boolean;
    overflow?: OverflowType;
    position?: PositionType;
    float?: FloatType;
    pointer?: boolean;
    visible?: boolean;
    textColor?: ColorVariantType;
    classNames?: string[];
}

export const Base: FC<BaseProps<HTMLDivElement>> = props =>
{
    const { ref = null, innerRef = null, fit = false, grow = false, shrink = false, fullWidth = false, fullHeight = false, overflow = null, position = null, float = null, pointer = false, visible = null, textColor = null, classNames = [], className = '', style = {}, ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [];

        if(fit || fullWidth) newClassNames.push('w-100');

        if(fit || fullHeight) newClassNames.push('h-100');

        if(grow) newClassNames.push('flex-grow-1');

        if(shrink) newClassNames.push('flex-shrink-0');

        if(overflow) newClassNames.push('overflow-' + overflow);

        if(position) newClassNames.push('position-' + position);

        if(float) newClassNames.push('float-' + float);

        if(pointer) newClassNames.push('cursor-pointer');

        if(visible !== null) newClassNames.push(visible ? 'visible' : 'invisible');

        if(textColor) newClassNames.push('text-' + textColor);

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ fit, grow, shrink, fullWidth, fullHeight, overflow, position, float, pointer, visible, textColor, classNames ]);

    const getClassName = useMemo(() =>
    {
        let newClassName = getClassNames.join(' ');

        if(className.length) newClassName += (' ' + className);

        return newClassName.trim();
    }, [ getClassNames, className ]);

    const getStyle = useMemo(() =>
    {
        let newStyle: CSSProperties = {};

        if(Object.keys(style).length) newStyle = { ...newStyle, ...style };

        return newStyle;
    }, [ style ]);
    
    return <div ref={ innerRef } className={ getClassName } style={ getStyle } { ...rest } />;
}
