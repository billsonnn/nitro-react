import { GetProductOfferComposer, IFurnitureData, MouseEventType } from '@nitrots/nitro-renderer';
import { FC, MouseEvent, useCallback } from 'react';
import { LayoutGridItem, LayoutGridItemProps } from '../../../../../common/layout/LayoutGridItem';
import { SendMessageHook } from '../../../../../hooks/messages/message-event';
import { AvatarImageView } from '../../../../../views/shared/avatar-image/AvatarImageView';
import { GetProductIconUrl } from '../../../common/GetProuductIconUrl';
import { ProductTypeEnum } from '../../../common/ProductTypeEnum';

export interface CatalogSearchResultOfferViewProps extends LayoutGridItemProps
{
    offer: IFurnitureData;
}

export const CatalogSearchResultOfferView: FC<CatalogSearchResultOfferViewProps> = props =>
{
    const { offer = null, ...rest } = props;

    const onMouseEvent = useCallback((event: MouseEvent) =>
    {
        switch(event.type)
        {
            case MouseEventType.MOUSE_DOWN:
                SendMessageHook(new GetProductOfferComposer(offer.purchaseOfferId));
                return;
        }
    }, [ offer ]);

    if(!offer) return null;

    const iconUrl = GetProductIconUrl(offer.id, offer.type, offer.customParams);

    return (
        <LayoutGridItem itemImage={ iconUrl } onMouseDown={ onMouseEvent } { ...rest }>
            { (offer.type === ProductTypeEnum.ROBOT) &&
                <AvatarImageView figure={ offer.customParams } direction={ 3 } headOnly={ true } /> }
        </LayoutGridItem>
    );
}
