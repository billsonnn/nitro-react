import { CatalogClubOfferData, CatalogPurchaseComposer, CatalogRequestVipOffersComposer } from 'nitro-renderer';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from 'react-bootstrap';
import { SendMessageHook } from '../../../../../../hooks/messages/message-event';
import { NitroCardGridItemView } from '../../../../../../layout/card/grid/item/NitroCardGridItemView';
import { NitroCardGridView } from '../../../../../../layout/card/grid/NitroCardGridView';
import { LocalizeText } from '../../../../../../utils/LocalizeText';
import { GLOBAL_PURSE } from '../../../../../purse/PurseView';
import { CurrencyIcon } from '../../../../../shared/currency-icon/CurrencyIcon';
import { GetCatalogPageImage } from '../../../../common/CatalogUtilities';
import { useCatalogContext } from '../../../../context/CatalogContext';
import { CatalogLayoutVipBuyViewProps } from './CatalogLayoutVipBuyView.types';

export const CatalogLayoutVipBuyView: FC<CatalogLayoutVipBuyViewProps> = props =>
{
    const { catalogState = null } = useCatalogContext();
    const { pageParser = null, clubOffers = null, subscriptionInfo = null } = catalogState;
    const [ pendingOffer, setPendingOffer ] = useState<CatalogClubOfferData>(null);

    const getOfferText = useCallback((offer: CatalogClubOfferData) =>
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

        SendMessageHook(new CatalogPurchaseComposer(pageParser.pageId, pendingOffer.offerId, null, 1));
    }, [ pendingOffer, pageParser ])

    useEffect(() =>
    {
        if(clubOffers === null)
        {
            SendMessageHook(new CatalogRequestVipOffersComposer(1));

            return;
        }
    }, [ clubOffers ]);

    return (
        <>
            <div className="row h-100 nitro-catalog-layout-vip-buy">
                <div className="col-7 h-100">
                    <NitroCardGridView columns={ 1 } className="vip-buy-grid">
                        { clubOffers && (clubOffers.length > 0) && clubOffers.map((offer, index) =>
                            {
                                return (
                                    <NitroCardGridItemView key={ index } className="justify-content-between p-1">
                                        { (pendingOffer === offer) &&
                                            <div className="d-flex flex-column justify-content-center align-items-center w-100">
                                                <div className="text-black text-small">{ getPurchaseHeader() }</div>
                                                <div className="text-black text-small">{ getPurchaseValidUntil() }</div>
                                                <Button variant="primary" size="sm" onClick={ purchaseSubscription }>{ LocalizeText('buy') }</Button>
                                            </div> }
                                        { (pendingOffer !== offer) &&
                                            <>
                                                <div className="d-flex flex-column text-black text-small m-1">
                                                    <div>
                                                        <i className="icon icon-catalogue-hc_small me-1"></i>
                                                        { getOfferText(offer) }
                                                    </div>
                                                    <div className="d-flex">
                                                        { (offer.priceCredits > 0) &&
                                                            <div className="d-flex align-items-center justify-content-end">
                                                                <span className="text-black ms-1">{ offer.priceCredits }</span>
                                                                <CurrencyIcon type={ -1 } />
                                                            </div> }
                                                        { (offer.priceActivityPoints > 0) &&
                                                            <div className="d-flex align-items-center justify-content-end">
                                                                <span className="text-black ms-1">{ offer.priceActivityPoints }</span>
                                                                <CurrencyIcon type={ offer.priceActivityPointsType } />
                                                            </div> }
                                                    </div>
                                                </div>
                                                <Button variant="primary" size="sm" onClick={ event => setPendingOffer(offer) }>{ LocalizeText('buy') }</Button>
                                            </> }
                                    </NitroCardGridItemView>
                                );
                            }) }
                    </NitroCardGridView>
                    {/* <div className="row row-cols-1 align-content-start g-0 mb-n1 w-100 catalog-offers-container h-100 overflow-auto">
                        { clubOffers && (clubOffers.length > 0) && clubOffers.map((offer, index) =>
                            {
                                return (
                                    <div key={ index } className="col pe-1 pb-1 catalog-offer-item-container">
                                        <div className="position-relative border border-2 rounded catalog-offer-item">
                                            <div className="d-flex align-items-center text-black text-small m-1">
                                                <i className="icon icon-catalogue-hc_small me-1"></i>
                                                { getOfferText(offer) }
                                            </div>
                                            <div className="d-flex">
                                                { (offer.priceCredits > 0) &&
                                                    <div className="d-flex align-items-center justify-content-end">
                                                        <span className="text-black ms-1">{ offer.priceCredits }</span>
                                                        <CurrencyIcon type={ -1 } />
                                                    </div> }
                                                { (offer.priceActivityPoints > 0) &&
                                                    <div className="d-flex align-items-center justify-content-end">
                                                        <span className="text-black ms-1">{ offer.priceActivityPoints }</span>
                                                        <CurrencyIcon type={ offer.priceActivityPointsType } />
                                                    </div> }
                                            </div>
                                            <Button variant="primary" size="sm" onClick={ event => setPendingOffer(offer) } />
                                        </div>
                                    </div>
                                );
                            }) }
                    </div> */}
                </div>
                <div className="position-relative d-flex flex-column col-5 justify-content-center align-items-center">
                    <div className="d-block mb-2">
                        <img alt="" src={ GetCatalogPageImage(pageParser, 1) } />
                    </div>
                    <div className="fs-6 text-center text-black lh-sm overflow-hidden" dangerouslySetInnerHTML={ {__html: getSubscriptionDetails } }></div>
                </div>
            </div>
        </>
    );
}
