import { CatalogPageMessageOfferData, CatalogPageMessageParser, RoomPreviewer } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { Base } from '../../../../../common/Base';
import { Column } from '../../../../../common/Column';
import { Text } from '../../../../../common/Text';
import { BadgeImageView } from '../../../../../views/shared/badge-image/BadgeImageView';
import { LimitedEditionCompletePlateView } from '../../../../../views/shared/limited-edition/LimitedEditionCompletePlateView';
import { GetOfferName } from '../../../common/CatalogUtilities';
import { CatalogRoomPreviewerView } from '../../catalog-room-previewer/CatalogRoomPreviewerView';
import { CatalogPageDetailsView } from '../../page-details/CatalogPageDetailsView';
import { CatalogPurchaseView } from '../purchase/CatalogPurchaseView';

export interface CatalogProductPreviewViewProps
{
    pageParser: CatalogPageMessageParser;
    activeOffer: CatalogPageMessageOfferData;
    roomPreviewer: RoomPreviewer;
    badgeCode?: string;
    extra?: string;
    disabled?: boolean;
}

export const CatalogProductPreviewView: FC<CatalogProductPreviewViewProps> = props =>
{
    const { pageParser = null, activeOffer = null, roomPreviewer = null, badgeCode = null, extra = '', disabled = false, children = null } = props;

    const product = ((activeOffer && activeOffer.products[0]) || null);

    if(!product) return <CatalogPageDetailsView pageParser={ pageParser } />;

    return (
        <>
            <Column overflow="hidden" position="relative" gap={ 0 }>
                { roomPreviewer && <CatalogRoomPreviewerView roomPreviewer={ roomPreviewer } height={ 140 } /> }
                { product.uniqueLimitedItem &&
                    <Base fullWidth position="absolute" className="top-1">
                        <LimitedEditionCompletePlateView className="mx-auto" uniqueLimitedItemsLeft={ product.uniqueLimitedItemsLeft } uniqueLimitedSeriesSize={ product.uniqueLimitedSeriesSize } />
                    </Base> }
                { badgeCode && badgeCode.length &&
                    <Base position="absolute" className="top-1 end-1">
                        <BadgeImageView badgeCode={ badgeCode } isGroup={ true } />
                    </Base> }
            </Column>
            <Column grow>
                <Text grow truncate>{ GetOfferName(activeOffer) }</Text>
                { children }
                <CatalogPurchaseView offer={ activeOffer } pageId={ pageParser.pageId } extra={ extra } disabled={ disabled } />
            </Column>
        </>
    );
}
