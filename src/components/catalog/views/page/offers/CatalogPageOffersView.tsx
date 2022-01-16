import { FC, useState } from 'react';
import { Grid, GridProps } from '../../../../../common/Grid';
import { IPurchasableOffer } from '../../../common/IPurchasableOffer';
import { CatalogPageOfferView } from './CatalogPageOfferView';

export interface CatalogPageOffersViewProps extends GridProps
{
    offers: IPurchasableOffer[];
}

export const CatalogPageOffersView: FC<CatalogPageOffersViewProps> = props =>
{
    const { offers = [], children = null, ...rest } = props;
    const [ activeOffer, setActiveOffer ] = useState<IPurchasableOffer>(null);

    return (
        <Grid grow columnCount={ 5 } overflow="auto" { ...rest }>
            { offers && (offers.length > 0) && offers.map((offer, index) => <CatalogPageOfferView key={ index } isActive={ (activeOffer === offer) } offer={ offer } setActiveOffer={ setActiveOffer } />) }
            { children }
        </Grid>
    );
}
