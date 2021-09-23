import { FC } from 'react';
import { LimitedEditionCompletePlateView } from '../../../../shared/limited-edition/complete-plate/LimitedEditionCompletePlateView';
import { GetOfferName } from '../../../common/CatalogUtilities';
import { useCatalogContext } from '../../../context/CatalogContext';
import { CatalogRoomPreviewerView } from '../../catalog-room-previewer/CatalogRoomPreviewerView';
import { CatalogPurchaseView } from '../purchase/CatalogPurchaseView';
import { CatalogLayoutSearchResultViewProps } from './CatalogLayoutSearchResultView.types';
import { CatalogSearchResultOffersView } from './offers/CatalogSearchResultOffersView';

export const CatalogLayoutSearchResultView: FC<CatalogLayoutSearchResultViewProps> = props =>
{
    const { roomPreviewer = null, furnitureDatas = null } = props;
    const { catalogState } = useCatalogContext();
    const { activeOffer = null } = catalogState;

    const product = ((activeOffer && activeOffer.products[0]) || null);

    return (
        <div className="row h-100">
            <div className="d-flex flex-column col-7 h-100">
                <CatalogSearchResultOffersView offers={ furnitureDatas } />
            </div>
            { product &&
                <div className="position-relative d-flex flex-column col">
                    <CatalogRoomPreviewerView roomPreviewer={ roomPreviewer } height={ 140 } />
                    { product.uniqueLimitedItem &&
                        <LimitedEditionCompletePlateView uniqueLimitedItemsLeft={ product.uniqueLimitedItemsLeft } uniqueLimitedSeriesSize={ product.uniqueLimitedSeriesSize } /> }
                    <div className="fs-6 text-black mt-1 overflow-hidden">{ GetOfferName(activeOffer) }</div>
                    <CatalogPurchaseView offer={ activeOffer } pageId={ -1 } />
                </div> }
        </div>
    );
}
