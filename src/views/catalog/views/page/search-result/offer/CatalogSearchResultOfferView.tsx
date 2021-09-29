import { GetProductOfferComposer, MouseEventType } from '@nitrots/nitro-renderer';
import { FC, MouseEvent, useCallback, useMemo } from 'react';
import { SendMessageHook } from '../../../../../../hooks/messages/message-event';
import { NitroCardGridItemView } from '../../../../../../layout';
import { AvatarImageView } from '../../../../../shared/avatar-image/AvatarImageView';
import { GetProductIconUrl } from '../../../../common/GetProuductIconUrl';
import { ProductTypeEnum } from '../../../../common/ProductTypeEnum';
import { CatalogSearchResultOfferViewProps } from './CatalogSearchResultOfferView.types';

export const CatalogSearchResultOfferView: FC<CatalogSearchResultOfferViewProps> = props =>
{
    const { isActive = false, offer = null } = props;

    const onMouseEvent = useCallback((event: MouseEvent) =>
    {
        switch(event.type)
        {
            case MouseEventType.MOUSE_DOWN:
                SendMessageHook(new GetProductOfferComposer(offer.purchaseOfferId));
                return;
        }
    }, [ offer ]);

    const iconUrl = useMemo(() =>
    {
        if(!offer) return null;
        
        return GetProductIconUrl(offer.id, offer.type, offer.customParams);
    }, [ offer ]);

    if(!offer) return null;

    return (
        <NitroCardGridItemView itemImage={ iconUrl } itemActive={ isActive } onMouseDown={ onMouseEvent }>
            { (offer.type === ProductTypeEnum.ROBOT) &&
                <AvatarImageView figure={ offer.customParams } direction={ 3 } headOnly={ true } /> }
        </NitroCardGridItemView>
    );
}
