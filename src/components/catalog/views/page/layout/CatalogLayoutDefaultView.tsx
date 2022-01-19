import { FC } from 'react';
import { Column } from '../../../../../common/Column';
import { Grid } from '../../../../../common/Grid';
import { useCatalogContext } from '../../../context/CatalogContext';
import { CatalogPageDetailsView } from '../../page-details/CatalogPageDetailsView';
import { CatalogProductPreviewView } from '../offers/CatalogPageOfferPreviewView';
import { CatalogItemGridWidgetView } from '../widgets/CatalogItemGridWidgetView';
import { CatalogLayoutProps } from './CatalogLayout.types';

export const CatalogLayoutDefaultView: FC<CatalogLayoutProps> = props =>
{
    const { page = null, roomPreviewer = null } = props;
    const { currentOffer = null } = useCatalogContext();

    return (
        <Grid>
            <Column size={ 7 } overflow="hidden">
                <CatalogItemGridWidgetView />
            </Column>
            <Column size={ 5 } overflow="hidden">
                { !currentOffer &&
                    <CatalogPageDetailsView page={ page } /> }
                { !!currentOffer &&
                    <CatalogProductPreviewView offer={ currentOffer } roomPreviewer={ roomPreviewer } /> }
            </Column>
        </Grid>
    );
}
