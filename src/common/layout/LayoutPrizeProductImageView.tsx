import { FC } from 'react';
import { ProductTypeEnum } from '../../api';
import { LayoutBadgeImageView } from './LayoutBadgeImageView';
import { LayoutCurrencyIcon } from './LayoutCurrencyIcon';
import { LayoutFurniImageView } from './LayoutFurniImageView';

interface LayoutPrizeProductImageViewProps
{
    productType: string;
    classId: number;
    extraParam?: string;
}

export const LayoutPrizeProductImageView: FC<LayoutPrizeProductImageViewProps> = props =>
{
    const { productType = ProductTypeEnum.FLOOR, classId = -1, extraParam = undefined } = props;

    switch(productType)
    {
        case ProductTypeEnum.WALL:
        case ProductTypeEnum.FLOOR:
            return <LayoutFurniImageView productType={ productType } productClassId={ classId } />
        case ProductTypeEnum.BADGE:
            return <LayoutBadgeImageView badgeCode={ extraParam }/>
        case ProductTypeEnum.HABBO_CLUB:
            return <LayoutCurrencyIcon type="hc" />
    }

    return null;
}
