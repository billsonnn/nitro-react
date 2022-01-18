import { FC } from 'react';
import { Grid, GridProps } from '../../../../../common/Grid';
import { IPurchasableOffer } from '../../../common/IPurchasableOffer';
import { useCatalogContext } from '../../../context/CatalogContext';
import { CatalogPageOfferView } from './CatalogPageOfferView';

export interface CatalogPageOffersViewProps extends GridProps
{
    offers: IPurchasableOffer[];
}

export const CatalogPageOffersView: FC<CatalogPageOffersViewProps> = props =>
{
    const { offers = [], children = null, ...rest } = props;
    const { currentOffer = null } = useCatalogContext();

    return (
        <Grid grow columnCount={ 5 } overflow="auto" { ...rest }>
            { offers && (offers.length > 0) && offers.map((offer, index) => <CatalogPageOfferView key={ index } isActive={ (currentOffer === offer) } offer={ offer } />) }
            { children }
        </Grid>
    );
}
