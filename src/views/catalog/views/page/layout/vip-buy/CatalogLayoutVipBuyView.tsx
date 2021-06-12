import { CatalogClubOfferData, CatalogRequestVipOffersComposer } from 'nitro-renderer';
import { FC, useCallback, useEffect, useMemo } from 'react';
import { SendMessageHook } from '../../../../../../hooks/messages/message-event';
import { LocalizeText } from '../../../../../../utils/LocalizeText';
import { CurrencyIcon } from '../../../../../currency-icon/CurrencyIcon';
import { useCatalogContext } from '../../../../context/CatalogContext';
import { GetCatalogPageImage } from '../../../../utils/CatalogUtilities';
import { CatalogLayoutVipBuyViewProps } from './CatalogLayoutVipBuyView.types';

export const CatalogLayoutVipBuyView: FC<CatalogLayoutVipBuyViewProps> = props =>
{
    const { catalogState = null } = useCatalogContext();
    const { pageParser = null, clubOffers = null, subscriptionInfo = null } = catalogState;

    useEffect(() =>
    {
        if(clubOffers === null)
        {
            SendMessageHook(new CatalogRequestVipOffersComposer(1));

            return;
        }
    }, [ clubOffers ]);

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

    const getSubscriptionDetails = useMemo(() =>
    {
        if(!subscriptionInfo) return '';

        const clubDays = subscriptionInfo.clubDays;
        const clubPeriods = subscriptionInfo.clubPeriods;
        const totalDays = (clubPeriods * 31) + clubDays;

        return LocalizeText('catalog.vip.extend.info', [ 'days' ], [ totalDays.toString() ]);
    }, [ subscriptionInfo ]);

    return (
        <div className="row h-100 nitro-catalog-layout-vip-buy">
            <div className="col-7">
                <div className="row row-cols-1 align-content-start g-0 mb-n1 w-100 catalog-offers-container">
                    { clubOffers && (clubOffers.length > 0) && clubOffers.map((offer, index) =>
                        {
                            return <div key={ index } className="col pe-1 pb-1 catalog-offer-item-container">
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
                                </div>
                            </div>;
                        })}
                </div>
            </div>
            <div className="position-relative d-flex flex-column col-5 justify-content-center align-items-center">
                <div className="d-block mb-2">
                    <img alt="" src={ GetCatalogPageImage(pageParser, 1) } />
                </div>
                <div className="fs-6 text-center text-black lh-sm overflow-hidden" dangerouslySetInnerHTML={ {__html: getSubscriptionDetails } }></div>
            </div>
        </div>
    );
}
