import { RoomPreviewer } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { Base } from '../../../../../common/Base';
import { Column } from '../../../../../common/Column';
import { Text } from '../../../../../common/Text';
import { BadgeImageView } from '../../../../../views/shared/badge-image/BadgeImageView';
import { LimitedEditionCompletePlateView } from '../../../../../views/shared/limited-edition/LimitedEditionCompletePlateView';
import { IPurchasableOffer } from '../../../common/IPurchasableOffer';
import { Offer } from '../../../common/Offer';
import { CatalogRoomPreviewerView } from '../../catalog-room-previewer/CatalogRoomPreviewerView';
import { CatalogPurchaseView } from '../purchase/CatalogPurchaseView';

export interface CatalogProductPreviewViewProps
{
    offer: IPurchasableOffer;
    roomPreviewer: RoomPreviewer;
    badgeCode?: string;
    extra?: string;
    disabled?: boolean;
}

export const CatalogProductPreviewView: FC<CatalogProductPreviewViewProps> = props =>
{
    const { offer = null, roomPreviewer = null, badgeCode = null, extra = null, disabled = false, children = null } = props;

    const product = ((offer && offer.product) || null);

    return (
        <>
            <Column overflow="hidden" position="relative" gap={ 0 }>
                { ((offer.pricingModel === Offer.PRICING_MODEL_SINGLE) || (offer.pricingModel === Offer.PRICING_MODEL_MULTI)) &&
                    <CatalogRoomPreviewerView roomPreviewer={ roomPreviewer } height={ 140 } /> }
                { product.isUniqueLimitedItem &&
                    <Base fullWidth position="absolute" className="top-1">
                        <LimitedEditionCompletePlateView className="mx-auto" uniqueLimitedItemsLeft={ product.uniqueLimitedItemsLeft } uniqueLimitedSeriesSize={ product.uniqueLimitedItemSeriesSize } />
                    </Base> }
                { badgeCode && (badgeCode.length > 0) &&
                    <Base position="absolute" className="top-1 end-1">
                        <BadgeImageView badgeCode={ badgeCode } isGroup={ true } />
                    </Base> }
                { offer.badgeCode && (offer.badgeCode.length > 0) &&
                    <Base position="absolute" className="top-1 end-1">
                        <BadgeImageView badgeCode={ offer.badgeCode } />
                    </Base> }
            </Column>
            <Column grow>
                <Text grow truncate>{ offer.localizationName }</Text>
                { children }
                <CatalogPurchaseView offer={ offer } pageId={ ((offer.page && offer.page.pageId) || -1) } extra={ extra } disabled={ disabled } />
            </Column>
        </>
    );
}
