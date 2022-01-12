import { SelectClubGiftComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback } from 'react';
import { LocalizeText } from '../../../../../../api';
import { Grid } from '../../../../../../common/Grid';
import { Text } from '../../../../../../common/Text';
import { SendMessageHook } from '../../../../../../hooks';
import { NotificationUtilities } from '../../../../../../views/notification-center/common/NotificationUtilities';
import { useCatalogContext } from '../../../../context/CatalogContext';
import { CatalogActions } from '../../../../reducers/CatalogReducer';
import { CatalogLayoutProps } from '../CatalogLayout.types';
import { VipGiftItem } from './VipGiftItemView';

export const CatalogLayoutVipGiftsView: FC<CatalogLayoutProps> = props =>
{
    const { catalogState, dispatchCatalogState } = useCatalogContext();
    
    const giftsAvailable = useCallback(() =>
    {
        const clubGifts = catalogState.clubGifts;

        if(!clubGifts) return '';

        if(clubGifts.giftsAvailable > 0)
        {
            return LocalizeText('catalog.club_gift.available', ['amount'], [clubGifts.giftsAvailable.toString()]);
        }

        if(clubGifts.daysUntilNextGift > 0)
        {
            return LocalizeText('catalog.club_gift.days_until_next', ['days'], [clubGifts.daysUntilNextGift.toString()]);
        }

        if(catalogState.subscriptionInfo.isVip)
        {
            return LocalizeText('catalog.club_gift.not_available');
        }

        return LocalizeText('catalog.club_gift.no_club');

    }, [catalogState.clubGifts, catalogState.subscriptionInfo.isVip]);

    const selectGift = useCallback((localizationId: string) =>
    {
        NotificationUtilities.confirm(LocalizeText('catalog.club_gift.confirm'), () =>
            {
                SendMessageHook(new SelectClubGiftComposer(localizationId));
                const prev = catalogState.clubGifts;

                prev.giftsAvailable--;

                dispatchCatalogState({
                    type: CatalogActions.SET_CLUB_GIFTS,
                    payload: {
                        clubGifts: prev
                    }
                });
            }, null);
    }, [catalogState.clubGifts, dispatchCatalogState]);
    
    return (
        <>
            <Text truncate shrink fontWeight="bold">{ giftsAvailable() }</Text>
            <Grid columnCount={ 1 } className="nitro-catalog-layout-vip-gifts-grid" overflow="auto">
                { (catalogState.clubGifts.offers.length > 0) && catalogState.clubGifts.offers.map(offer => <VipGiftItem key={ offer.offerId } offer={ offer } isAvailable={ (catalogState.clubGifts.getOfferExtraData(offer.offerId).isSelectable && (catalogState.clubGifts.giftsAvailable > 0)) } onSelect={ selectGift }/>) }
            </Grid>
        </>
    )
}
