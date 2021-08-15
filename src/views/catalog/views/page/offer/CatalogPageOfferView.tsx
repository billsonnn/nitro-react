import { MouseEventType } from '@nitrots/nitro-renderer';
import { FC, MouseEvent, useCallback } from 'react';
import { useCatalogContext } from '../../../context/CatalogContext';
import { CatalogActions } from '../../../reducers/CatalogReducer';
import { CatalogProductView } from '../product/CatalogProductView';
import { CatalogPageOfferViewProps } from './CatalogPageOfferView.types';

export const CatalogPageOfferView: FC<CatalogPageOfferViewProps> = props =>
{
    const { isActive = false, offer = null } = props;
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

    return <CatalogProductView isActive={ isActive } product={ product } onMouseEvent={ onMouseEvent } />
}
