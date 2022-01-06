import { GetProductOfferComposer, IFurnitureData } from '@nitrots/nitro-renderer';
import { FC, useEffect } from 'react';
import { Grid, GridProps } from '../../../../../common/Grid';
import { SendMessageHook } from '../../../../../hooks/messages/message-event';
import { useCatalogContext } from '../../../context/CatalogContext';
import { CatalogSearchResultOfferView } from './CatalogSearchResultOfferView';

export interface CatalogSearchResultOffersViewProps extends GridProps
{
    offers: IFurnitureData[];
}

export const CatalogSearchResultOffersView: FC<CatalogSearchResultOffersViewProps> = props =>
{
    const { offers = [], children = null, ...rest } = props;
    const { catalogState = null } = useCatalogContext();
    const { activeOffer = null } = catalogState;

    useEffect(() =>
    {
        if(!offers || !offers.length) return;

        SendMessageHook(new GetProductOfferComposer(offers[0].purchaseOfferId));
    }, [ offers ]);

    return (
        <Grid grow columnCount={ 5 } overflow="auto" { ...rest }>
            { offers && (offers.length > 0) && offers.map((offer, index) =>
                {
                    const isActive = (activeOffer && (activeOffer.products[0].furniClassId === offer.id));

                    return <CatalogSearchResultOfferView key={ index } itemActive={ isActive } offer={ offer } />
                })}
            { children }
        </Grid>
    );
}
