import { FC } from 'react';
import { LayoutImage, LayoutImageProps } from '.';
import { GetImageIconUrlForProduct } from '../../api';

interface LayoutFurniIconImageViewProps extends LayoutImageProps
{
    productType: string;
    productClassId: number;
    extraData?: string;
}

export const LayoutFurniIconImageView: FC<LayoutFurniIconImageViewProps> = props =>
{
    const { productType = 's', productClassId = -1, extraData = '', ...rest } = props;

    return <LayoutImage imageUrl={ GetImageIconUrlForProduct(productType, productClassId, extraData) } className="furni-image" { ...rest } />;
}
