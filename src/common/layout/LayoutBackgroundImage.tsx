import { FC, useMemo } from 'react';
import { Base, BaseProps } from '../Base';

export interface LayoutBackgroundImageProps extends BaseProps<HTMLDivElement>
{
    imageUrl?: string;
}

export const LayoutBackgroundImage: FC<LayoutBackgroundImageProps> = props =>
{
    const { imageUrl = null, fit = true, style = null, ...rest } = props;

    const getStyle = useMemo(() =>
    {
        const newStyle = { ...style };

        if(imageUrl) newStyle.background = `url(${ imageUrl }) center no-repeat`;

        return newStyle;
    }, [ style, imageUrl ]);

    return <Base fit={ fit } style={ getStyle } { ...rest } />;
};
