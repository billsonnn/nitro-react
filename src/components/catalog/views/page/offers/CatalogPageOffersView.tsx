import { CatalogPageMessageOfferData } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { Grid, GridProps } from '../../../../../common/Grid';
import { useCatalogContext } from '../../../context/CatalogContext';
import { CatalogPageOfferView } from './CatalogPageOfferView';

export interface CatalogPageOffersViewProps extends GridProps
{
    offers: CatalogPageMessageOfferData[];
}

export const CatalogPageOffersView: FC<CatalogPageOffersViewProps> = props =>
{
    const { offers = [], children = null, ...rest } = props;
    const { catalogState = null } = useCatalogContext();
    const { activeOffer = null } = catalogState;

    return (
        <Grid grow columnCount={ 5 } overflow="auto" { ...rest }>
            { offers && (offers.length > 0) && offers.map((offer, index) => <CatalogPageOfferView key={ index } isActive={ (activeOffer === offer) } offer={ offer } />) }
            { children }
        </Grid>
    );
}
