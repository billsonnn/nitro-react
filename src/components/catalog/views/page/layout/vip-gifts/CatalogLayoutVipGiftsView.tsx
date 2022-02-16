import { SelectClubGiftComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback } from 'react';
import { LocalizeText } from '../../../../../../api';
import { AutoGrid } from '../../../../../../common/AutoGrid';
import { Text } from '../../../../../../common/Text';
import { SendMessageHook } from '../../../../../../hooks';
import { NotificationUtilities } from '../../../../../../views/notification-center/common/NotificationUtilities';
import { useCatalogContext } from '../../../../CatalogContext';
import { CatalogLayoutProps } from '../CatalogLayout.types';
import { VipGiftItem } from './VipGiftItemView';

export const CatalogLayoutVipGiftsView: FC<CatalogLayoutProps> = props =>
{
    const { catalogOptions = null, setCatalogOptions = null } = useCatalogContext();
    const { clubGifts = null, subscriptionInfo = null } = catalogOptions;
    
    const giftsAvailable = useCallback(() =>
    {
        if(!clubGifts) return '';

        if(clubGifts.giftsAvailable > 0) return LocalizeText('catalog.club_gift.available', [ 'amount' ], [ clubGifts.giftsAvailable.toString() ]);

        if(clubGifts.daysUntilNextGift > 0) return LocalizeText('catalog.club_gift.days_until_next', [ 'days' ], [ clubGifts.daysUntilNextGift.toString() ]);

        if(subscriptionInfo.isVip) return LocalizeText('catalog.club_gift.not_available');

        return LocalizeText('catalog.club_gift.no_club');
    }, [ clubGifts, subscriptionInfo ]);

    const selectGift = useCallback((localizationId: string) =>
    {
        NotificationUtilities.confirm(LocalizeText('catalog.club_gift.confirm'), () =>
            {
                SendMessageHook(new SelectClubGiftComposer(localizationId));

                setCatalogOptions(prevValue =>
                    {
                        prevValue.clubGifts.giftsAvailable--;

                        return { ...prevValue };
                    });
            }, null);
    }, [ setCatalogOptions ]);
    
    return (
        <>
            <Text truncate shrink fontWeight="bold">{ giftsAvailable() }</Text>
            <AutoGrid columnCount={ 1 } className="nitro-catalog-layout-vip-gifts-grid">
                { (clubGifts.offers.length > 0) && clubGifts.offers.map(offer => <VipGiftItem key={ offer.offerId } offer={ offer } isAvailable={ (clubGifts.getOfferExtraData(offer.offerId).isSelectable && (clubGifts.giftsAvailable > 0)) } onSelect={ selectGift }/>) }
            </AutoGrid>
        </>
    )
}
