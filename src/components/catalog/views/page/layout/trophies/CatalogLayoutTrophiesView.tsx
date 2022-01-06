import { FC, useState } from 'react';
import { Column } from '../../../../../../common/Column';
import { Grid } from '../../../../../../common/Grid';
import { useCatalogContext } from '../../../../context/CatalogContext';
import { CatalogPageOffersView } from '../../offers/CatalogPageOffersView';
import { CatalogProductPreviewView } from '../../product-preview/CatalogProductPreviewView';
import { CatalogLayoutProps } from '../CatalogLayout.types';

export const CatalogLayoutTrophiesView: FC<CatalogLayoutProps> = props =>
{
    const { roomPreviewer = null, pageParser = null } = props;
    const { catalogState = null, dispatchCatalogState = null } = useCatalogContext();
    const { activeOffer = null } = catalogState;
    const [ trophyText, setTrophyText ] = useState<string>('');

    const product = ((activeOffer && activeOffer.products[0]) || null);

    return (
        <Grid>
            <Column size={ 7 } overflow="hidden">
                <CatalogPageOffersView offers={ pageParser.offers } />
                <textarea className="flex-grow-1 form-control w-100" defaultValue={ trophyText || '' } onChange={ event => setTrophyText(event.target.value) } />
            </Column>
            <Column size={ 5 } overflow="hidden">
                <CatalogProductPreviewView pageParser={ pageParser } activeOffer={ activeOffer } roomPreviewer={ roomPreviewer } extra={ trophyText } />
            </Column>
        </Grid>
    );
}
