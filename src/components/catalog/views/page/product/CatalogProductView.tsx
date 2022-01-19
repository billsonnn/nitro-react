import { FC } from 'react';
import { LayoutGridItem, LayoutGridItemProps } from '../../../../../common/layout/LayoutGridItem';
import { AvatarImageView } from '../../../../../views/shared/avatar-image/AvatarImageView';
import { IProduct } from '../../../common/IProduct';
import { ProductTypeEnum } from '../../../common/ProductTypeEnum';

export interface CatalogProductViewProps extends LayoutGridItemProps
{
    product: IProduct;
}

export const CatalogProductView: FC<CatalogProductViewProps> = props =>
{
    const { product = null, children = null, ...rest } = props;

    if(!product) return null;

    const iconUrl = product.getIconUrl(null);

    return (
        <LayoutGridItem itemImage={ iconUrl } itemCount={ product.productCount } itemUniqueSoldout={ (product.uniqueLimitedItemSeriesSize && !product.uniqueLimitedItemsLeft) } itemUniqueNumber={ product.uniqueLimitedItemSeriesSize } { ...rest }>
            { (product.productType === ProductTypeEnum.ROBOT) &&
                <AvatarImageView figure={ product.extraParam } direction={ 3 } headOnly={ true } /> }
            { children }
        </LayoutGridItem>
    );
}
