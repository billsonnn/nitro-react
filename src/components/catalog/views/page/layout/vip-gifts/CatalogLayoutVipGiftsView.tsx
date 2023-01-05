import { SelectClubGiftComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useMemo } from 'react';
import { LocalizeText, SendMessageComposer } from '../../../../../../api';
import { AutoGrid, Text } from '../../../../../../common';
import { useCatalog, useNotification, usePurse } from '../../../../../../hooks';
import { CatalogLayoutProps } from '../CatalogLayout.types';
import { VipGiftItem } from './VipGiftItemView';

export const CatalogLayoutVipGiftsView: FC<CatalogLayoutProps> = props =>
{
    const { purse = null } = usePurse();
    const { catalogOptions = null, setCatalogOptions = null } = useCatalog();
    const { clubGifts = null } = catalogOptions;
    const { showConfirm = null } = useNotification();
    
    const giftsAvailable = useCallback(() =>
    {
        if(!clubGifts) return '';

        if(clubGifts.giftsAvailable > 0) return LocalizeText('catalog.club_gift.available', [ 'amount' ], [ clubGifts.giftsAvailable.toString() ]);

        if(clubGifts.daysUntilNextGift > 0) return LocalizeText('catalog.club_gift.days_until_next', [ 'days' ], [ clubGifts.daysUntilNextGift.toString() ]);

        if(purse.isVip) return LocalizeText('catalog.club_gift.not_available');

        return LocalizeText('catalog.club_gift.no_club');
    }, [ clubGifts, purse ]);

    const selectGift = useCallback((localizationId: string) =>
    {
        showConfirm(LocalizeText('catalog.club_gift.confirm'), () =>
        {
            SendMessageComposer(new SelectClubGiftComposer(localizationId));

            setCatalogOptions(prevValue =>
            {
                prevValue.clubGifts.giftsAvailable--;

                return { ...prevValue };
            });
        }, null);
    }, [ setCatalogOptions, showConfirm ]);

    const sortGifts = useMemo(() => 
    {
        let gifts = clubGifts.offers.sort((a,b) => 
        {
            return clubGifts.getOfferExtraData(a.offerId).daysRequired - clubGifts.getOfferExtraData(b.offerId).daysRequired;
        })
        return gifts;
    },[ clubGifts ]);
    
    
    return (
        <>
            <Text truncate shrink fontWeight="bold">{ giftsAvailable() }</Text>
            <AutoGrid columnCount={ 1 } className="nitro-catalog-layout-vip-gifts-grid">
                { (clubGifts.offers.length > 0) && sortGifts.map(offer => <VipGiftItem key={ offer.offerId } offer={ offer } isAvailable={ (clubGifts.getOfferExtraData(offer.offerId).isSelectable && (clubGifts.giftsAvailable > 0)) } onSelect={ selectGift } daysRequired={ clubGifts.getOfferExtraData(offer.offerId).daysRequired }/>) }
            </AutoGrid>
        </>
    )
}
