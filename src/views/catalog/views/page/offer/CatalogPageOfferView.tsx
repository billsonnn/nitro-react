import { FurnitureType, MouseEventType } from 'nitro-renderer';
import { FC, MouseEvent, useCallback, useState } from 'react';
import { GetRoomEngine, GetSessionDataManager } from '../../../../../api';
import { GetConfiguration } from '../../../../../utils/GetConfiguration';
import { AvatarImageView } from '../../../../avatar-image/AvatarImageView';
import { LimitedEditionStyledNumberView } from '../../../../limited-edition/styled-number/LimitedEditionStyledNumberView';
import { useCatalogContext } from '../../../context/CatalogContext';
import { ProductTypeEnum } from '../../../enums/ProductTypeEnum';
import { CatalogActions } from '../../../reducers/CatalogReducer';
import { CatalogPageOfferViewProps } from './CatalogPageOfferView.types';

export const CatalogPageOfferView: FC<CatalogPageOfferViewProps> = props =>
{
    const { isActive = false, offer = null } = props;
    const [ isMouseDown, setMouseDown ] = useState(false);
    const { dispatchCatalogState = null } = useCatalogContext();

    const onMouseEvent = useCallback((event: MouseEvent) =>
    {
        switch(event.type)
        {
            case MouseEventType.MOUSE_CLICK:
                if(isActive) return;

                dispatchCatalogState({
                    type: CatalogActions.SET_CATALOG_ACTIVE_OFFER,
                    payload: {
                        activeOffer: offer
                    }
                });
                return;
        }
    }, [ isActive, offer, dispatchCatalogState ]);

    const product = ((offer.products && offer.products[0]) || null);

    if(!product) return null;

    function getIconUrl(): string
    {
        const productType = product.productType.toUpperCase();

        switch(productType)
        {
            case FurnitureType.BADGE:
                return GetSessionDataManager().getBadgeUrl(product.extraParam);
            case FurnitureType.ROBOT:
                return null;
            case FurnitureType.FLOOR:
                return GetRoomEngine().getFurnitureFloorIconUrl(product.furniClassId);
            case FurnitureType.WALL: {
                const furniData = GetSessionDataManager().getWallItemData(product.furniClassId);
                
                let iconName = '';

                if(furniData)
                {
                    switch(furniData.className)
                    {
                        case 'floor':
                            iconName = ['th', furniData.className, product.extraParam].join('_');
                            break;
                        case 'wallpaper':
                            iconName = ['th', 'wall', product.extraParam].join('_');
                            break;
                        case 'landscape':
                            iconName = ['th', furniData.className, product.extraParam.replace('.', '_'), '001'].join('_');
                            break;
                    }

                    if(iconName !== '')
                    {
                        const assetUrl = GetConfiguration<string>('catalog.asset.url');

                        return `${ assetUrl }/${ iconName }.png`;
                    }
                }

                return GetRoomEngine().getFurnitureWallIconUrl(product.furniClassId, product.extraParam);
            }
        }

        return '';
    }

    const iconUrl = getIconUrl();
    const imageUrl = (iconUrl && iconUrl.length) ? `url(${ iconUrl })` : null;

    return (
        <div className="col pe-1 pb-1 catalog-offer-item-container">
            <div className={ 'position-relative border border-2 rounded catalog-offer-item cursor-pointer ' + (isActive ? 'active ' : '') + (product.uniqueLimitedItem ? 'unique-item ' : '') + ((product.uniqueLimitedItem && !product.uniqueLimitedItemsLeft) ? 'sold-out ' : '') } style={ { backgroundImage: imageUrl }} onClick={ onMouseEvent }>
                { !imageUrl && (product.productType === ProductTypeEnum.ROBOT) &&
                    <AvatarImageView figure={ product.extraParam } direction={ 3 } headOnly={ true } /> }
                { (product.productCount > 1) && <span className="position-absolute badge border bg-danger px-1 rounded-circle">{ product.productCount }</span> }
                { product.uniqueLimitedItem && 
                    <div className="position-absolute unique-item-counter">
                        <LimitedEditionStyledNumberView value={ product.uniqueLimitedSeriesSize } />
                    </div> }
            </div>
        </div>
    );
}
