import { ClubOfferData, GetClubOffersMessageComposer, PurchaseFromCatalogComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { LocalizeText } from '../../../../../../api';
import { CatalogEvent } from '../../../../../../events/catalog/CatalogEvent';
import { useUiEvent } from '../../../../../../hooks';
import { SendMessageHook } from '../../../../../../hooks/messages/message-event';
import { NitroLayoutFlexColumn, NitroLayoutGrid, NitroLayoutGridColumn } from '../../../../../../layout';
import { NitroLayoutBase } from '../../../../../../layout/base';
import { NitroCardGridItemView } from '../../../../../../layout/card/grid/item/NitroCardGridItemView';
import { NitroCardGridView } from '../../../../../../layout/card/grid/NitroCardGridView';
import { LoadingSpinnerView } from '../../../../../../layout/loading-spinner/LoadingSpinnerView';
import { GetCurrencyAmount } from '../../../../../purse/common/CurrencyHelper';
import { GLOBAL_PURSE } from '../../../../../purse/PurseView';
import { CurrencyIcon } from '../../../../../shared/currency-icon/CurrencyIcon';
import { GetCatalogPageImage } from '../../../../common/CatalogUtilities';
import { useCatalogContext } from '../../../../context/CatalogContext';
import { CatalogPurchaseState } from '../../purchase/purchase-button/CatalogPurchaseButtonView.types';
import { CatalogLayoutVipBuyViewProps } from './CatalogLayoutVipBuyView.types';

export const CatalogLayoutVipBuyView: FC<CatalogLayoutVipBuyViewProps> = props =>
{
    const { catalogState = null } = useCatalogContext();
    const { pageParser = null, clubOffers = null, subscriptionInfo = null } = catalogState;

    const [ pendingOffer, setPendingOffer ] = useState<ClubOfferData>(null);
    const [ purchaseState, setPurchaseState ] = useState(CatalogPurchaseState.NONE);

    const onCatalogEvent = useCallback((event: CatalogEvent) =>
    {
        switch(event.type)
        {
            case CatalogEvent.PURCHASE_SUCCESS:
                setPurchaseState(CatalogPurchaseState.NONE);
                return;
            case CatalogEvent.PURCHASE_FAILED:
                setPurchaseState(CatalogPurchaseState.FAILED);
                return;
        }
    }, []);

    useUiEvent(CatalogEvent.PURCHASE_SUCCESS, onCatalogEvent);
    useUiEvent(CatalogEvent.PURCHASE_FAILED, onCatalogEvent);

    const getOfferText = useCallback((offer: ClubOfferData) =>
    {
        let offerText = '';

        if(offer.months > 0)
        {
            offerText = LocalizeText('catalog.vip.item.header.months', [ 'num_months' ], [ offer.months.toString() ]);
        }

        if(offer.extraDays > 0)
        {
            if(offerText !== '') offerText += ' ';
            
            offerText += (' ' + LocalizeText('catalog.vip.item.header.days', [ 'num_days' ], [ offer.extraDays.toString() ]));
        }

        return offerText;
    }, []);

    const getPurchaseHeader = useCallback(() =>
    {
        const purse = GLOBAL_PURSE;

        if(!purse) return '';

        const extensionOrSubscription = (purse.clubDays > 0 || purse.clubPeriods > 0) ? 'extension.' : 'subscription.';
        const daysOrMonths = ((pendingOffer.months === 0) ? 'days' : 'months');
        const daysOrMonthsText = ((pendingOffer.months === 0) ? pendingOffer.extraDays : pendingOffer.months);
        const locale = LocalizeText('catalog.vip.buy.confirm.' + extensionOrSubscription + daysOrMonths);

        return locale.replace('%NUM_' + daysOrMonths.toUpperCase() + '%', daysOrMonthsText.toString());
    }, [ pendingOffer ]);

    const getPurchaseValidUntil = useCallback(() =>
    {
        let locale = LocalizeText('catalog.vip.buy.confirm.end_date');

        locale = locale.replace('%month%', pendingOffer.month.toString());
        locale = locale.replace('%day%', pendingOffer.day.toString());
        locale = locale.replace('%year%', pendingOffer.year.toString());

        return locale;
    }, [ pendingOffer ]);

    const getSubscriptionDetails = useMemo(() =>
    {
        if(!subscriptionInfo) return '';

        const clubDays = subscriptionInfo.clubDays;
        const clubPeriods = subscriptionInfo.clubPeriods;
        const totalDays = (clubPeriods * 31) + clubDays;

        return LocalizeText('catalog.vip.extend.info', [ 'days' ], [ totalDays.toString() ]);
    }, [ subscriptionInfo ]);

    const purchaseSubscription = useCallback(() =>
    {
        if(!pendingOffer) return;

        setPurchaseState(CatalogPurchaseState.PURCHASE);
        SendMessageHook(new PurchaseFromCatalogComposer(pageParser.pageId, pendingOffer.offerId, null, 1));
    }, [ pendingOffer, pageParser ]);

    useEffect(() =>
    {
        if(clubOffers === null) SendMessageHook(new GetClubOffersMessageComposer(1));
    }, [ clubOffers ]);

    const setOffer = useCallback((offer: ClubOfferData) =>
    {
        setPurchaseState(CatalogPurchaseState.NONE);
        setPendingOffer(offer);
    }, []);

    const getPurchaseButton = useCallback(() =>
    {
        if(!pendingOffer) return null;

        if(pendingOffer.priceCredits > GetCurrencyAmount(-1))
        {
            return <button className="btn btn-danger btn-sm w-100">{ LocalizeText('catalog.alert.notenough.title') }</button>;
        }

        if(pendingOffer.priceActivityPoints > GetCurrencyAmount(pendingOffer.priceActivityPointsType))
        {
            return <button className="btn btn-danger btn-sm w-100">{ LocalizeText('catalog.alert.notenough.activitypoints.title.' + pendingOffer.priceActivityPointsType) }</button>;
        }

        switch(purchaseState)
        {
            case CatalogPurchaseState.CONFIRM:
                return <button type="button" className="btn btn-warning w-100" onClick={ purchaseSubscription }>{ LocalizeText('catalog.marketplace.confirm_title') }</button>;
            case CatalogPurchaseState.PURCHASE:
                return <button type="button" className="btn btn-primary w-100" disabled><LoadingSpinnerView /></button>;
            case CatalogPurchaseState.FAILED:
                return <button type="button" className="btn btn-danger w-100" disabled>{ LocalizeText('generic.failed') }</button>;
            case CatalogPurchaseState.NONE:
            default:
                return <button type="button" className="btn btn-success w-100" onClick={ () => setPurchaseState(CatalogPurchaseState.CONFIRM) }>{ LocalizeText('buy') }</button>;
        }
    }, [ pendingOffer, purchaseState, purchaseSubscription ]);

    return (
        <NitroLayoutGrid>
            <NitroLayoutGridColumn size={ 7 }>
                <NitroCardGridView columns={ 1 } className="vip-buy-grid">
                    { clubOffers && (clubOffers.length > 0) && clubOffers.map((offer, index) =>
                        {
                            return (
                                <NitroCardGridItemView key={ index } className="justify-content-between py-1 px-2 text-black" itemActive={ pendingOffer === offer } onClick={ () => setOffer(offer) }>
                                    <i className="icon icon-hc-banner" />
                                    <div className="fw-bold">
                                        <div className="text-end">{ getOfferText(offer) }</div>
                                        <div className="d-flex gap-2 justify-content-end">
                                            { (offer.priceCredits > 0) &&
                                                <div className="d-flex align-items-center justify-content-end gap-1">
                                                    <span className="text-black">{ offer.priceCredits }</span>
                                                    <CurrencyIcon type={ -1 } />
                                                </div> }
                                            { (offer.priceActivityPoints > 0) &&
                                                <div className="d-flex align-items-center justify-content-end gap-1">
                                                    <span className="text-black">{ offer.priceActivityPoints }</span>
                                                    <CurrencyIcon type={ offer.priceActivityPointsType } />
                                                </div> }
                                        </div>
                                    </div>
                                </NitroCardGridItemView>
                            );
                    })}
                    <div className="mt-auto text-black">{ LocalizeText('catalog.vip.buy.hccenter') }</div>
                </NitroCardGridView>
            </NitroLayoutGridColumn>
            <NitroLayoutGridColumn size={ 5 }>
                <NitroLayoutFlexColumn className="justify-content-center align-items-center h-100" overflow="hidden" gap={ 2 }>
                    { GetCatalogPageImage(pageParser, 1) && <img className="" alt="" src={ GetCatalogPageImage(pageParser, 1) } /> }
                    <NitroLayoutBase className="text-center text-black" overflow="auto" dangerouslySetInnerHTML={{ __html: getSubscriptionDetails }} />
                </NitroLayoutFlexColumn>
                { pendingOffer && <div className="mt-auto w-100 text-black">
                    <div className="d-flex gap-2 mb-2 align-items-center">
                        <div className="w-100">
                            <div className="fw-bold">{ getPurchaseHeader() }</div>
                            <div className="small">{ getPurchaseValidUntil() }</div>
                        </div>
                        <div>
                            { (pendingOffer.priceCredits > 0) &&
                                <div className="d-flex align-items-center justify-content-end gap-1">
                                    <span className="text-black">{ pendingOffer.priceCredits }</span>
                                    <CurrencyIcon type={ -1 } />
                                </div> }
                            { (pendingOffer.priceActivityPoints > 0) &&
                                <div className="d-flex align-items-center justify-content-end gap-1">
                                    <span className="text-black">{ pendingOffer.priceActivityPoints }</span>
                                    <CurrencyIcon type={ pendingOffer.priceActivityPointsType } />
                                </div> }
                        </div>
                    </div>
                    { getPurchaseButton() }
                </div> }
            </NitroLayoutGridColumn>
        </NitroLayoutGrid>
    );
}
