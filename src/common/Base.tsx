import { CSSProperties, DetailedHTMLProps, FC, HTMLAttributes, MutableRefObject, ReactNode, useMemo } from 'react';
import { ColorVariantType, DisplayType, FloatType, OverflowType, PositionType } from './types';

export interface BaseProps<T = HTMLElement> extends DetailedHTMLProps<HTMLAttributes<T>, T>
{
    innerRef?: MutableRefObject<T>;
    display?: DisplayType;
    fit?: boolean;
    fitV?: boolean;
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
    children?: ReactNode;
}

export const Base: FC<BaseProps<HTMLDivElement>> = props =>
{
    const { ref = null, innerRef = null, display = null, fit = false, fitV = false, grow = false, shrink = false, fullWidth = false, fullHeight = false, overflow = null, position = null, float = null, pointer = false, visible = null, textColor = null, classNames = [], className = '', style = {}, children = null, ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [];

        if(display && display.length) newClassNames.push('d-' + display);

        if(fit || fullWidth) newClassNames.push('w-100');

        if(fit || fullHeight) newClassNames.push('h-100');

        if(fitV) newClassNames.push('vw-100', 'vh-100');

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
    }, [ display, fit, fitV, grow, shrink, fullWidth, fullHeight, overflow, position, float, pointer, visible, textColor, classNames ]);

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
    
    return (
        <div ref={ innerRef } className={ getClassName } style={ getStyle } { ...rest }>
            { children }
        </div>
    );
}
