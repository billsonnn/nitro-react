import { SelectClubGiftComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback } from 'react';
import { LocalizeText } from '../../../../../../api';
import { SendMessageHook } from '../../../../../../hooks';
import { NitroCardGridView } from '../../../../../../layout';
import { NitroLayoutBase } from '../../../../../../layout/base';
import { NotificationUtilities } from '../../../../../notification-center/common/NotificationUtilities';
import { useCatalogContext } from '../../../../context/CatalogContext';
import { CatalogActions } from '../../../../reducers/CatalogReducer';
import { CatalogLayoutProps } from '../CatalogLayout.types';
import { VipGiftItem } from './gift-item/VipGiftItemView';

export interface CatalogLayoutVipGiftsViewProps extends CatalogLayoutProps
{

}

export const CatalogLayoutVipGiftsView: FC<CatalogLayoutVipGiftsViewProps> = props =>
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
        <NitroLayoutBase className='text-black'>{giftsAvailable()}</NitroLayoutBase>
        <NitroCardGridView columns={1} className='text-black'>
            { catalogState.clubGifts && catalogState.clubGifts.offers.map( (offer, index) => <VipGiftItem key={index} offer={offer} isAvailable={ catalogState.clubGifts.getOfferExtraData(offer.offerId).isSelectable && catalogState.clubGifts.giftsAvailable > 0} onSelect={selectGift}/>)}
        </NitroCardGridView>
        </>
    )
}
