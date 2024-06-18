import { DetailedHTMLProps, FC, HTMLAttributes } from 'react';

export interface LayoutImageProps extends DetailedHTMLProps<HTMLAttributes<HTMLImageElement>, HTMLImageElement>
{
    imageUrl?: string;
}

export const LayoutImage: FC<LayoutImageProps> = props =>
{
    const { imageUrl = null, className = '', ...rest } = props;

    return <img alt="" className={ 'no-select ' + className } src={ imageUrl } { ...rest } />;
};
