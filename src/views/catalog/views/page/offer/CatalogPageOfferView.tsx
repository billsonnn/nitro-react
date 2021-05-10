import { FurnitureType, MouseEventType } from 'nitro-renderer';
import { FC, MouseEvent, useCallback } from 'react';
import { GetRoomEngine, GetSessionDataManager } from '../../../../../api';
import { LimitedEditionStyledNumberView } from '../../../../limited-edition/styled-number/LimitedEditionStyledNumberView';
import { useCatalogContext } from '../../../context/CatalogContext';
import { CatalogActions } from '../../../reducers/CatalogReducer';
import { CatalogPageOfferViewProps } from './CatalogPageOfferView.types';

export const CatalogPageOfferView: FC<CatalogPageOfferViewProps> = props =>
{
    const { isActive = false, offer = null } = props;
    const { dispatchCatalogState = null } = useCatalogContext();

    const onMouseEvent = useCallback((event: MouseEvent) =>
    {
        switch(event.type)
        {
            case MouseEventType.MOUSE_DOWN:
                dispatchCatalogState({
                    type: CatalogActions.SET_CATALOG_ACTIVE_OFFER,
                    payload: {
                        activeOffer: offer
                    }
                });
                return;
            case MouseEventType.MOUSE_UP:
                return;
            case MouseEventType.ROLL_OUT:
                return;
        }
    }, [ offer, dispatchCatalogState ]);

    const product = ((offer.products && offer.products[0]) || null);

    if(!product) return null;

    function getIconUrl(): string
    {
        const productType = product.productType.toUpperCase();

        switch(productType)
        {
            case FurnitureType.BADGE:
                return GetSessionDataManager().getBadgeUrl(product.extraParam);
            case FurnitureType.FLOOR:
                return GetRoomEngine().getFurnitureFloorIconUrl(product.furniClassId);
            case FurnitureType.WALL:
                return GetRoomEngine().getFurnitureWallIconUrl(product.furniClassId, product.extraParam);
        }

        return '';
    }

    const imageUrl = `url(${ getIconUrl() })`;

    return (
        <div className="col pe-1 pb-1 catalog-offer-item-container">
            <div className={ 'position-relative border border-2 rounded catalog-offer-item cursor-pointer ' + (isActive ? 'active ' : '') + (product.uniqueLimitedItem ? 'unique-item ' : '') + ((product.uniqueLimitedItem && !product.uniqueLimitedItemsLeft) ? 'sold-out ' : '') } style={ { backgroundImage: imageUrl }} onMouseDown={ onMouseEvent } onMouseUp={ onMouseEvent } onMouseOut={ onMouseEvent }>
                { (product.productCount > 1) && <span className="position-absolute badge border bg-danger px-1 rounded-circle">{ product.productCount }</span> }
                { product.uniqueLimitedItem && 
                    <div className="position-absolute unique-item-counter">
                        <LimitedEditionStyledNumberView value={ product.uniqueLimitedSeriesSize } />
                    </div> }
            </div>
        </div>
    );
}
