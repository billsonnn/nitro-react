import { FC } from 'react';
import { GetImageIconUrlForProduct } from '../../api';
import { LayoutImage, LayoutImageProps } from './LayoutImage';

interface LayoutFurniIconImageViewProps extends LayoutImageProps
{
    productType: string;
    productClassId: number;
    extraData?: string;
}

export const LayoutFurniIconImageView: FC<LayoutFurniIconImageViewProps> = props =>
{
    const { productType = 's', productClassId = -1, extraData = '', ...rest } = props;

    return <LayoutImage className="furni-image" imageUrl={ GetImageIconUrlForProduct(productType, productClassId, extraData) } { ...rest } />;
};
