import { FC, useState } from 'react';
import { useCatalogContext } from '../../../../context/CatalogContext';
import { CatalogPageOffersView } from '../../offers/CatalogPageOffersView';
import { CatalogProductPreviewView } from '../../product-preview/CatalogProductPreviewView';
import { CatalogLayoutTrophiesViewProps } from './CatalogLayoutTrophiesView.types';

export const CatalogLayoutTrophiesView: FC<CatalogLayoutTrophiesViewProps> = props =>
{
    const { roomPreviewer = null, pageParser = null } = props;
    const { catalogState = null, dispatchCatalogState = null } = useCatalogContext();
    const { activeOffer = null } = catalogState;
    const [ trophyText, setTrophyText ] = useState<string>('');

    const product = ((activeOffer && activeOffer.products[0]) || null);

    return (
        <div className="row h-100">
            <div className="d-flex flex-column col-7 gap-2 h-100">
                <CatalogPageOffersView offers={ pageParser.offers } />
                <textarea className="flex-grow-1 form-control w-100" defaultValue={ trophyText || '' } onChange={ event => setTrophyText(event.target.value) } />
            </div>
            <div className="position-relative d-flex flex-column col-5">
                <CatalogProductPreviewView pageParser={ pageParser } activeOffer={ activeOffer } roomPreviewer={ roomPreviewer } extra={ trophyText } />
            </div>
        </div>
    );
}
