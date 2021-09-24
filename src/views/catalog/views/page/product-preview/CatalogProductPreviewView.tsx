import { FC } from 'react';
import { LimitedEditionCompletePlateView } from '../../../../shared/limited-edition/complete-plate/LimitedEditionCompletePlateView';
import { GetOfferName } from '../../../common/CatalogUtilities';
import { CatalogRoomPreviewerView } from '../../catalog-room-previewer/CatalogRoomPreviewerView';
import { CatalogPageDetailsView } from '../../page-details/CatalogPageDetailsView';
import { CatalogPurchaseView } from '../purchase/CatalogPurchaseView';
import { CatalogProductPreviewViewProps } from './CatalogProductPreviewView.types';

export const CatalogProductPreviewView: FC<CatalogProductPreviewViewProps> = props =>
{
    const { pageParser = null, activeOffer = null, roomPreviewer = null, extra = '', disabled = false, children = null } = props;

    const product = ((activeOffer && activeOffer.products[0]) || null);

    if(!product) return <CatalogPageDetailsView pageParser={ pageParser } />;

    return (
        <>
            <div className="position-relative d-flex flex-column overflow-auto h-100">
                <CatalogRoomPreviewerView roomPreviewer={ roomPreviewer } height={ 140 } />
                { product.uniqueLimitedItem &&
                    <LimitedEditionCompletePlateView uniqueLimitedItemsLeft={ product.uniqueLimitedItemsLeft } uniqueLimitedSeriesSize={ product.uniqueLimitedSeriesSize } /> }
            </div>
            <div className="d-flex flex-column gap-2">
                <div className="flex-grow-1 text-black text-truncate">{ GetOfferName(activeOffer) }</div>
                { children }
                <CatalogPurchaseView offer={ activeOffer } pageId={ pageParser.pageId } extra={ extra } disabled={ disabled } />
            </div>
        </>
    );
}
