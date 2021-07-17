import { FC, useState } from 'react';
import { GetOfferName } from '../../../../common/CatalogUtilities';
import { useCatalogContext } from '../../../../context/CatalogContext';
import { CatalogRoomPreviewerView } from '../../../catalog-room-previewer/CatalogRoomPreviewerView';
import { CatalogPageOffersView } from '../../offers/CatalogPageOffersView';
import { CatalogPurchaseView } from '../../purchase/CatalogPurchaseView';
import { CatalogLayoutTrophiesViewProps } from './CatalogLayoutTrophiesView.types';

export const CatalogLayoutTrophiesView: FC<CatalogLayoutTrophiesViewProps> = props =>
{
    const { roomPreviewer = null, pageParser = null } = props;
    const { catalogState = null, dispatchCatalogState = null } = useCatalogContext();
    const { activeOffer = null } = catalogState;
    const [ trophyText, setTrophyText ] = useState<string>('');

    const product = ((activeOffer && activeOffer.products[0]) || null);

    return (
        <div className="row h-100 nitro-catalog-layout-trophies">
            <div className="d-flex flex-column col-7 h-100">
                <CatalogPageOffersView offers={ pageParser.offers } />
                <div className="d-flex mt-2">
                    <textarea className="form-control w-100" defaultValue={ trophyText || '' } onChange={ event => setTrophyText(event.target.value) }></textarea>
                </div>
            </div>
            { product &&
                <div className="position-relative d-flex flex-column col">
                    <CatalogRoomPreviewerView roomPreviewer={ roomPreviewer } height={ 140 } />
                    <div className="fs-6 text-black mt-1 overflow-hidden">{ GetOfferName(activeOffer) }</div>
                    <CatalogPurchaseView offer={ activeOffer } pageId={ pageParser.pageId } extra={ trophyText } />
                </div> }
        </div>
    );
}
