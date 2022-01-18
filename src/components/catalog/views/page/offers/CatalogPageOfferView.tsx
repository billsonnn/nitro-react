import { GetProductOfferComposer, MouseEventType } from '@nitrots/nitro-renderer';
import { FC, MouseEvent, useCallback, useState } from 'react';
import { SendMessageHook } from '../../../../../hooks';
import { FurnitureOffer } from '../../../common/FurnitureOffer';
import { IPurchasableOffer } from '../../../common/IPurchasableOffer';
import { useCatalogContext } from '../../../context/CatalogContext';
import { CatalogProductView } from '../product/CatalogProductView';

export interface CatalogPageOfferViewProps
{
    isActive: boolean;
    offer: IPurchasableOffer;
}

export const CatalogPageOfferView: FC<CatalogPageOfferViewProps> = props =>
{
    const { isActive = false, offer = null } = props;
    const [ isMouseDown, setMouseDown ] = useState(false);
    const { setCurrentOffer = null } = useCatalogContext();

    const onMouseEvent = useCallback((event: MouseEvent) =>
    {
        switch(event.type)
        {
            case MouseEventType.MOUSE_CLICK:
                if(isActive) return;

                setCurrentOffer(offer);

                if(offer instanceof FurnitureOffer)
                {
                    SendMessageHook(new GetProductOfferComposer(offer.offerId));
                }
                return;
            case MouseEventType.MOUSE_DOWN:
                setMouseDown(true);
                return;
            case MouseEventType.MOUSE_UP:
                setMouseDown(false);
                return;
            case MouseEventType.ROLL_OUT:
                if(!isMouseDown || !isActive) return;
                return;
        }
    }, [ isActive, offer, isMouseDown, setCurrentOffer ]);

    const product = offer.product;

    if(!product) return null;

    return <CatalogProductView itemActive={ isActive } product={ product } onClick={ onMouseEvent } onMouseDown={ onMouseEvent } onMouseUp={ onMouseEvent } onMouseOut={ onMouseEvent } />
}
