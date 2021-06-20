import { CatalogSearchComposer } from 'nitro-renderer';
import { FC, useEffect } from 'react';
import { SendMessageHook } from '../../../../../../hooks/messages/message-event';
import { useCatalogContext } from '../../../../context/CatalogContext';
import { CatalogSearchResultOfferView } from '../offer/CatalogSearchResultOfferView';
import { CatalogSearchResultOffersViewProps } from './CatalogSearchResultOffersView.types';

export const CatalogSearchResultOffersView: FC<CatalogSearchResultOffersViewProps> = props =>
{
    const { offers = [] } = props;
    const { catalogState } = useCatalogContext();
    const { activeOffer = null } = catalogState;

    useEffect(() =>
    {
        if(!offers || !offers.length) return;

        SendMessageHook(new CatalogSearchComposer(offers[0].purchaseOfferId));
    }, [ offers ]);

    return (
        <div className="row row-cols-5 align-content-start g-0 mb-n1 w-100 catalog-offers-container h-100">
            { offers && (offers.length > 0) && offers.map((offer, index) =>
                {
                    const isActive = (activeOffer && (activeOffer.products[0].furniClassId === offer.id));

                    return <CatalogSearchResultOfferView key={ index } isActive={ isActive } offer={ offer } />
                }) }
        </div>
    );
}
