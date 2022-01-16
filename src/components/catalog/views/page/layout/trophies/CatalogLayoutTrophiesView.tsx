import { FC, useState } from 'react';
import { Column } from '../../../../../../common/Column';
import { Grid } from '../../../../../../common/Grid';
import { useCatalogContext } from '../../../../context/CatalogContext';
import { CatalogProductPreviewView } from '../../offers/CatalogPageOfferPreviewView';
import { CatalogPageOffersView } from '../../offers/CatalogPageOffersView';
import { CatalogLayoutProps } from '../CatalogLayout.types';

export const CatalogLayoutTrophiesView: FC<CatalogLayoutProps> = props =>
{
    const { page = null, roomPreviewer = null } = props;
    const [ trophyText, setTrophyText ] = useState<string>('');
    const { currentOffer = null } = useCatalogContext();

    return (
        <Grid>
            <Column size={ 7 } overflow="hidden">
                <CatalogPageOffersView offers={ page.offers } />
                <textarea className="flex-grow-1 form-control w-100" defaultValue={ trophyText || '' } onChange={ event => setTrophyText(event.target.value) } />
            </Column>
            <Column size={ 5 } overflow="hidden">
                { !!currentOffer &&
                    <CatalogProductPreviewView offer={ currentOffer } roomPreviewer={ roomPreviewer } extra={ trophyText } /> }
            </Column>
        </Grid>
    );
}
