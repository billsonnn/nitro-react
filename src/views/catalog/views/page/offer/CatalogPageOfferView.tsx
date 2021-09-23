import { MouseEventType } from '@nitrots/nitro-renderer';
import { FC, MouseEvent, useCallback, useState } from 'react';
import { useCatalogContext } from '../../../context/CatalogContext';
import { CatalogActions } from '../../../reducers/CatalogReducer';
import { CatalogProductView } from '../product/CatalogProductView';
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
    }, [ isActive, offer, isMouseDown, dispatchCatalogState ]);

    const product = ((offer.products && offer.products[0]) || null);

    if(!product) return null;

    return <CatalogProductView isActive={ isActive } product={ product } onClick={ onMouseEvent } onMouseDown={ onMouseEvent } onMouseUp={ onMouseEvent } onMouseOut={ onMouseEvent } />
}
