import { CatalogSearchComposer, FurnitureType, MouseEventType } from 'nitro-renderer';
import { FC, MouseEvent, useCallback } from 'react';
import { GetConfiguration, GetRoomEngine, GetSessionDataManager } from '../../../../../../api';
import { SendMessageHook } from '../../../../../../hooks/messages/message-event';
import { CatalogSearchResultOfferViewProps } from './CatalogSearchResultOfferView.types';

export const CatalogSearchResultOfferView: FC<CatalogSearchResultOfferViewProps> = props =>
{
    const { isActive = false, offer = null } = props;

    const onMouseEvent = useCallback((event: MouseEvent) =>
    {
        switch(event.type)
        {
            case MouseEventType.MOUSE_DOWN:
                SendMessageHook(new CatalogSearchComposer(offer.purchaseOfferId));
                return;
            case MouseEventType.MOUSE_UP:
                return;
            case MouseEventType.ROLL_OUT:
                return;
        }
    }, [ offer ]);

    function getIconUrl(): string
    {
        const productType = offer.type.toUpperCase();

        switch(productType)
        {
            case FurnitureType.BADGE:
                return GetSessionDataManager().getBadgeUrl(offer.customParams);
            case FurnitureType.FLOOR:
                return GetRoomEngine().getFurnitureFloorIconUrl(offer.id);
            case FurnitureType.WALL:
                const furniData = GetSessionDataManager().getWallItemData(offer.id);
                
                let iconName = '';

                if(furniData)
                {
                    switch(furniData.className)
                    {
                        case 'floor':
                            iconName = ['th', furniData.className, offer.customParams].join('_');
                            break;
                        case 'wallpaper':
                            iconName = ['th', 'wall', offer.customParams].join('_');
                            break;
                        case 'landscape':
                            iconName = ['th', furniData.className, offer.customParams.replace('.', '_'), '001'].join('_');
                            break;
                    }

                    if(iconName !== '')
                    {
                        const assetUrl = GetConfiguration<string>('catalog.asset.url');

                        return `${ assetUrl }/${ iconName }.png`;
                    }
                }

                return GetRoomEngine().getFurnitureWallIconUrl(offer.id, offer.customParams);
        }

        return '';
    }

    const imageUrl = `url(${ getIconUrl() })`;

    return (
        <div className="col pe-1 pb-1 catalog-offer-item-container">
            <div className={ 'position-relative border border-2 rounded catalog-offer-item cursor-pointer ' + (isActive ? 'active ' : '') } style={ { backgroundImage: imageUrl }} onMouseDown={ onMouseEvent } onMouseUp={ onMouseEvent } onMouseOut={ onMouseEvent } />
        </div>
    );
}
