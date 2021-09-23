import { FC, useMemo } from 'react';
import { NitroCardGridItemView } from '../../../../../layout';
import { AvatarImageView } from '../../../../shared/avatar-image/AvatarImageView';
import { GetProductIconUrl } from '../../../common/GetProuductIconUrl';
import { ProductTypeEnum } from '../../../common/ProductTypeEnum';
import { CatalogProductViewProps } from './CatalogProductView.types';

export const CatalogProductView: FC<CatalogProductViewProps> = props =>
{
    const { isActive = false, product = null, ...rest } = props;

    const iconUrl = useMemo(() =>
    {
        if(!product) return null;
        
        return GetProductIconUrl(product.furniClassId, product.productType, product.extraParam);
    }, [ product ]);

    const getUniqueNumber = useMemo(() =>
    {
        if(!product.uniqueLimitedItem) return 0;

        if(!product.uniqueLimitedItemsLeft) return -1;

        return product.uniqueLimitedSeriesSize;
    }, [ product ]);

    if(!product) return null;

    return (
        <NitroCardGridItemView itemImage={ iconUrl } itemActive={ isActive } itemCount={ product.productCount } itemUniqueNumber={ getUniqueNumber } { ...rest }>
            { (product.productType === ProductTypeEnum.ROBOT) &&
                <AvatarImageView figure={ product.extraParam } direction={ 3 } headOnly={ true } /> }
        </NitroCardGridItemView>
    );
}
