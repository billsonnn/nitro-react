import { FC } from 'react';
import { Column } from '../../../../../../common/Column';
import { Grid } from '../../../../../../common/Grid';
import { useCatalogContext } from '../../../../context/CatalogContext';
import { CatalogPageOffersView } from '../../offers/CatalogPageOffersView';
import { CatalogProductPreviewView } from '../../product-preview/CatalogProductPreviewView';
import { CatalogLayoutProps } from '../CatalogLayout.types';

export const CatalogLayoutDefaultView: FC<CatalogLayoutProps> = props =>
{
    const { roomPreviewer = null, pageParser = null } = props;
    const { catalogState = null } = useCatalogContext();
    const { activeOffer = null } = catalogState;

    return (
        <Grid>
            <Column size={ 7 } overflow="hidden">
                <CatalogPageOffersView offers={ pageParser.offers } />
            </Column>
            <Column size={ 5 } overflow="hidden">
                <CatalogProductPreviewView pageParser={ pageParser } activeOffer={ activeOffer } roomPreviewer={ roomPreviewer } />
            </Column>
        </Grid>
    );
}
