import { CSSProperties, DetailedHTMLProps, FC, HTMLAttributes, LegacyRef, useMemo } from 'react';
import { OverflowType } from './types/OverflowType';
import { PositionType } from './types/PositionType';

export interface BaseProps<T = HTMLElement> extends DetailedHTMLProps<HTMLAttributes<T>, T>
{
    innerRef?: LegacyRef<T>;
    fit?: boolean;
    fullWidth?: boolean;
    fullHeight?: boolean;
    overflow?: OverflowType;
    position?: PositionType;
    pointer?: boolean;
    classNames?: string[];
}

export const Base: FC<BaseProps<HTMLDivElement>> = props =>
{
    const { ref = null, innerRef = null, fit = false, fullWidth = false, fullHeight = false, overflow = null, position = null, pointer = false, classNames = [], className = '', style = {}, ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [];

        if(fit || fullWidth) newClassNames.push('w-100');

        if(fit || fullHeight) newClassNames.push('h-100');

        if(overflow) newClassNames.push('overflow-' + overflow);

        if(position) newClassNames.push('position-' + position);

        if(pointer) newClassNames.push('cursor-pointer');

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ fit, fullWidth, fullHeight, overflow, position, pointer, classNames ]);

    const getClassName = useMemo(() =>
    {
        let newClassName = getClassNames.join(' ');

        if(className.length) newClassName += (' ' + className);

        return newClassName;
    }, [ getClassNames, className ]);

    const getStyle = useMemo(() =>
    {
        let newStyle: CSSProperties = {};

        if(Object.keys(style).length) newStyle = { ...newStyle, ...style };

        return newStyle;
    }, [ style ]);
    
    return <div ref={ innerRef } className={ getClassName } style={ getStyle } { ...rest } />;
}
