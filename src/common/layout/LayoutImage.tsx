import { DetailedHTMLProps, FC, HTMLAttributes } from 'react';

export interface LayoutImageProps extends DetailedHTMLProps<HTMLAttributes<HTMLImageElement>, HTMLImageElement>
{
    imageUrl?: string;
}

export const LayoutImage: FC<LayoutImageProps> = props =>
{
    const { imageUrl = null, ...rest } = props;

    return <img src={ imageUrl } alt="" { ...rest } />;
}
