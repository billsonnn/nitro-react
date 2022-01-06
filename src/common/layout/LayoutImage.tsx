import { FC, useMemo } from 'react';
import { Base, BaseProps } from '../Base';

export interface LayoutImageProps extends BaseProps<HTMLDivElement>
{
    imageUrl?: string;
}

export const LayoutImage: FC<LayoutImageProps> = props =>
{
    const { imageUrl = null, fit = true, style = null, ...rest } = props;

    const getStyle = useMemo(() =>
    {
        const newStyle = { ...style };

        if(imageUrl) newStyle.background = `url(${ imageUrl }) center no-repeat`;

        return newStyle;
    }, [ style, imageUrl ]);

    return <Base fit={ fit } style={ getStyle } { ...rest } />;
}
