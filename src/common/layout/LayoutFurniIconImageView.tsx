import { FC } from 'react';
import { LayoutImage, LayoutImageProps } from '.';
import { GetRoomEngine, ProductTypeEnum } from '../../api';

interface LayoutFurniIconImageViewProps extends LayoutImageProps
{
    productType: string;
    productClassId: number;
    extraData?: string;
}

export const LayoutFurniIconImageView: FC<LayoutFurniIconImageViewProps> = props =>
{
    const { productType = 's', productClassId = -1, extraData = '', ...rest } = props;

    const getImageIconUrl = () =>
    {
        let imageUrl: string = null;

        switch(productType.toLocaleLowerCase())
        {
            case ProductTypeEnum.FLOOR:
                imageUrl = GetRoomEngine().getFurnitureFloorIconUrl(productClassId);
                break;
            case ProductTypeEnum.WALL:
                imageUrl = GetRoomEngine().getFurnitureWallIconUrl(productClassId, extraData);
                break;
        }

        return imageUrl;
    }

    return <LayoutImage imageUrl={ getImageIconUrl() } className="furni-image" { ...rest } />;
}
