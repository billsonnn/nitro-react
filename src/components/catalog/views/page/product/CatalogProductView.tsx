import { CatalogPageMessageProductData } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { LayoutGridItem, LayoutGridItemProps } from '../../../../../common/layout/LayoutGridItem';
import { AvatarImageView } from '../../../../../views/shared/avatar-image/AvatarImageView';
import { GetProductIconUrl } from '../../../common/GetProuductIconUrl';
import { ProductTypeEnum } from '../../../common/ProductTypeEnum';

export interface CatalogProductViewProps extends LayoutGridItemProps
{
    product: CatalogPageMessageProductData;
}

export const CatalogProductView: FC<CatalogProductViewProps> = props =>
{
    const { product = null, ...rest } = props;

    if(!product) return null;

    const iconUrl = GetProductIconUrl(product.furniClassId, product.productType, product.extraParam);

    return (
        <LayoutGridItem itemImage={ iconUrl } itemCount={ product.productCount } itemUniqueSoldout={ (product.uniqueLimitedSeriesSize && !product.uniqueLimitedItemsLeft) } itemUniqueNumber={ product.uniqueLimitedSeriesSize } { ...rest }>
            { (product.productType === ProductTypeEnum.ROBOT) &&
                <AvatarImageView figure={ product.extraParam } direction={ 3 } headOnly={ true } /> }
        </LayoutGridItem>
    );
}
