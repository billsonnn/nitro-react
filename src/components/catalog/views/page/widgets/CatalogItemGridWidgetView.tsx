import { FC } from 'react';
import { Grid, GridProps } from '../../../../../common/Grid';
import { useCatalogContext } from '../../../context/CatalogContext';
import { CatalogGridOfferView } from '../offers/CatalogGridOfferView';

interface CatalogItemGridWidgetViewProps extends GridProps
{

}

export const CatalogItemGridWidgetView: FC<CatalogItemGridWidgetViewProps> = props =>
{
    const { children = null, ...rest } = props;
    const { currentOffer = null, currentPage = null } = useCatalogContext();

    if(!currentPage) return null;

    return (
        <Grid grow columnCount={ 5 } overflow="auto" { ...rest }>
            { currentPage.offers && (currentPage.offers.length > 0) && currentPage.offers.map((offer, index) => <CatalogGridOfferView key={ index } itemActive={ (currentOffer === offer) } offer={ offer } />) }
            { children }
        </Grid>
    );
}
