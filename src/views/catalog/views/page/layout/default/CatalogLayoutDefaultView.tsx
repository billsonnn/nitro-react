import { FC } from 'react';
import { NitroLayoutGrid, NitroLayoutGridColumn } from '../../../../../../layout';
import { useCatalogContext } from '../../../../context/CatalogContext';
import { CatalogPageOffersView } from '../../offers/CatalogPageOffersView';
import { CatalogProductPreviewView } from '../../product-preview/CatalogProductPreviewView';
import { CatalogLayoutDefaultViewProps } from './CatalogLayoutDefaultView.types';

export const CatalogLayoutDefaultView: FC<CatalogLayoutDefaultViewProps> = props =>
{
    const { roomPreviewer = null, pageParser = null } = props;
    const { catalogState = null } = useCatalogContext();
    const { activeOffer = null } = catalogState;

    const product = ((activeOffer && activeOffer.products[0]) || null);

    return (
        <NitroLayoutGrid>
            <NitroLayoutGridColumn size={ 7 }>
                <CatalogPageOffersView offers={ pageParser.offers } />
            </NitroLayoutGridColumn>
            <NitroLayoutGridColumn size={ 5 }>
                <CatalogProductPreviewView pageParser={ pageParser } activeOffer={ activeOffer } roomPreviewer={ roomPreviewer } />
            </NitroLayoutGridColumn>
        </NitroLayoutGrid>
    );
}
