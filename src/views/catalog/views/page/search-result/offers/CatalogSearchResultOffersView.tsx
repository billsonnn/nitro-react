import { GetProductOfferComposer } from '@nitrots/nitro-renderer';
import { FC, useEffect } from 'react';
import { SendMessageHook } from '../../../../../../hooks/messages/message-event';
import { NitroCardGridView } from '../../../../../../layout';
import { useCatalogContext } from '../../../../context/CatalogContext';
import { CatalogSearchResultOfferView } from '../offer/CatalogSearchResultOfferView';
import { CatalogSearchResultOffersViewProps } from './CatalogSearchResultOffersView.types';

export const CatalogSearchResultOffersView: FC<CatalogSearchResultOffersViewProps> = props =>
{
    const { offers = [], ...rest } = props;
    const { catalogState = null } = useCatalogContext();
    const { activeOffer = null } = catalogState;

    useEffect(() =>
    {
        if(!offers || !offers.length) return;

        SendMessageHook(new GetProductOfferComposer(offers[0].purchaseOfferId));
    }, [ offers ]);

    return (
        <NitroCardGridView { ...rest }>
            { offers && (offers.length > 0) && offers.map((offer, index) =>
                {
                    const isActive = (activeOffer && (activeOffer.products[0].furniClassId === offer.id));

                    return <CatalogSearchResultOfferView key={ index } isActive={ isActive } offer={ offer } />
                })}
        </NitroCardGridView>
    );
}
