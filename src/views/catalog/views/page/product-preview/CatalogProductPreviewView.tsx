import { FC } from 'react';
import { NitroLayoutFlexColumn } from '../../../../../layout';
import { NitroLayoutBase } from '../../../../../layout/base';
import { BadgeImageView } from '../../../../shared/badge-image/BadgeImageView';
import { LimitedEditionCompletePlateView } from '../../../../shared/limited-edition/complete-plate/LimitedEditionCompletePlateView';
import { GetOfferName } from '../../../common/CatalogUtilities';
import { CatalogRoomPreviewerView } from '../../catalog-room-previewer/CatalogRoomPreviewerView';
import { CatalogPageDetailsView } from '../../page-details/CatalogPageDetailsView';
import { CatalogPurchaseView } from '../purchase/CatalogPurchaseView';
import { CatalogProductPreviewViewProps } from './CatalogProductPreviewView.types';

export const CatalogProductPreviewView: FC<CatalogProductPreviewViewProps> = props =>
{
    const { pageParser = null, activeOffer = null, roomPreviewer = null, badgeCode = null, extra = '', disabled = false, children = null } = props;

    const product = ((activeOffer && activeOffer.products[0]) || null);

    if(!product) return <CatalogPageDetailsView pageParser={ pageParser } />;

    return (
        <>
            <NitroLayoutFlexColumn overflow="hidden" position="relative">
                { roomPreviewer && <CatalogRoomPreviewerView roomPreviewer={ roomPreviewer } height={ 140 } /> }
                { product.uniqueLimitedItem &&
                    <NitroLayoutBase className="top-2 end-2" position="absolute">
                        <LimitedEditionCompletePlateView uniqueLimitedItemsLeft={ product.uniqueLimitedItemsLeft } uniqueLimitedSeriesSize={ product.uniqueLimitedSeriesSize } />
                    </NitroLayoutBase> }
                { badgeCode && badgeCode.length &&
                    <NitroLayoutBase className="top-2 end-2" position="absolute">
                        <BadgeImageView badgeCode={ badgeCode } isGroup={ true } />
                    </NitroLayoutBase> }
            </NitroLayoutFlexColumn>
            <NitroLayoutFlexColumn className="flex-grow-1" gap={ 2 }>
                <NitroLayoutBase className="flex-grow-1 text-black text-truncate">{ GetOfferName(activeOffer) }</NitroLayoutBase>
                { children }
                <CatalogPurchaseView offer={ activeOffer } pageId={ pageParser.pageId } extra={ extra } disabled={ disabled } />
            </NitroLayoutFlexColumn>
        </>
    );
}
