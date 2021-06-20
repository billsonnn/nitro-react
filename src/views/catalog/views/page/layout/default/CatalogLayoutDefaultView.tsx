import { FC } from 'react';
import { LimitedEditionCompletePlateView } from '../../../../../limited-edition/complete-plate/LimitedEditionCompletePlateView';
import { RoomPreviewerView } from '../../../../../room-previewer/RoomPreviewerView';
import { useCatalogContext } from '../../../../context/CatalogContext';
import { GetCatalogPageImage, GetCatalogPageText, GetOfferName } from '../../../../utils/CatalogUtilities';
import { CatalogPageOffersView } from '../../offers/CatalogPageOffersView';
import { CatalogPurchaseView } from '../../purchase/CatalogPurchaseView';
import { CatalogLayoutDefaultViewProps } from './CatalogLayoutDefaultView.types';

export const CatalogLayoutDefaultView: FC<CatalogLayoutDefaultViewProps> = props =>
{
    const { roomPreviewer = null, pageParser = null } = props;
    const { catalogState = null } = useCatalogContext();
    const { activeOffer = null } = catalogState;

    const product = ((activeOffer && activeOffer.products[0]) || null);

    return (
        <div className="row h-100">
            <div className="col-7 h-100">
                <CatalogPageOffersView offers={ pageParser.offers } />
            </div>
            { !product &&
                <div className="position-relative d-flex flex-column col-5 justify-content-center align-items-center">
                    <div className="d-block mb-2">
                        <img alt="" src={ GetCatalogPageImage(pageParser, 1) } />
                    </div>
                    <div className="fs-6 text-center text-black lh-sm overflow-hidden">{ GetCatalogPageText(pageParser, 0) }</div>
                </div> }
            { product &&
                <div className="position-relative d-flex flex-column col-5">
                    <RoomPreviewerView roomPreviewer={ roomPreviewer } height={ 140 } />
                    { product.uniqueLimitedItem &&
                        <LimitedEditionCompletePlateView uniqueLimitedItemsLeft={ product.uniqueLimitedItemsLeft } uniqueLimitedSeriesSize={ product.uniqueLimitedSeriesSize } /> }
                    <div className="fs-6 text-black mt-1 overflow-hidden">{ GetOfferName(activeOffer) }</div>
                    <CatalogPurchaseView offer={ activeOffer } pageId={ pageParser.pageId } />
                </div> }
        </div>
    );
}
