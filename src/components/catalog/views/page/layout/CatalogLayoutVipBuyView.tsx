import { ClubOfferData, GetClubOffersMessageComposer, PurchaseFromCatalogComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { CatalogPurchaseState, LocalizeText, SendMessageComposer } from '../../../../../api';
import { AutoGrid, Button, Column, Flex, Grid, LayoutCurrencyIcon, LayoutGridItem, LayoutLoadingSpinnerView, Text } from '../../../../../common';
import { CatalogEvent, CatalogPurchaseFailureEvent, CatalogPurchasedEvent } from '../../../../../events';
import { useCatalog, usePurse, useUiEvent } from '../../../../../hooks';
import { CatalogLayoutProps } from './CatalogLayout.types';

export const CatalogLayoutVipBuyView: FC<CatalogLayoutProps> = props =>
{
    const [ pendingOffer, setPendingOffer ] = useState<ClubOfferData>(null);
    const [ purchaseState, setPurchaseState ] = useState(CatalogPurchaseState.NONE);
    const { currentPage = null, catalogOptions = null } = useCatalog();
    const { purse = null, getCurrencyAmount = null } = usePurse();
    const { clubOffers = null } = catalogOptions;

    const onCatalogEvent = useCallback((event: CatalogEvent) =>
    {
        switch(event.type)
        {
            case CatalogPurchasedEvent.PURCHASE_SUCCESS:
                setPurchaseState(CatalogPurchaseState.NONE);
                return;
            case CatalogPurchaseFailureEvent.PURCHASE_FAILED:
                setPurchaseState(CatalogPurchaseState.FAILED);
                return;
        }
    }, []);

    useUiEvent(CatalogPurchasedEvent.PURCHASE_SUCCESS, onCatalogEvent);
    useUiEvent(CatalogPurchaseFailureEvent.PURCHASE_FAILED, onCatalogEvent);

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
        if(!purse) return '';

        const extensionOrSubscription = (purse.clubDays > 0 || purse.clubPeriods > 0) ? 'extension.' : 'subscription.';
        const daysOrMonths = ((pendingOffer.months === 0) ? 'days' : 'months');
        const daysOrMonthsText = ((pendingOffer.months === 0) ? pendingOffer.extraDays : pendingOffer.months);
        const locale = LocalizeText('catalog.vip.buy.confirm.' + extensionOrSubscription + daysOrMonths);

        return locale.replace('%NUM_' + daysOrMonths.toUpperCase() + '%', daysOrMonthsText.toString());
    }, [ pendingOffer, purse ]);

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
        const clubDays = purse.clubDays;
        const clubPeriods = purse.clubPeriods;
        const totalDays = (clubPeriods * 31) + clubDays;

        return LocalizeText('catalog.vip.extend.info', [ 'days' ], [ totalDays.toString() ]);
    }, [ purse ]);

    const purchaseSubscription = useCallback(() =>
    {
        if(!pendingOffer) return;

        setPurchaseState(CatalogPurchaseState.PURCHASE);
        SendMessageComposer(new PurchaseFromCatalogComposer(currentPage.pageId, pendingOffer.offerId, null, 1));
    }, [ pendingOffer, currentPage ]);

    const setOffer = useCallback((offer: ClubOfferData) =>
    {
        setPurchaseState(CatalogPurchaseState.NONE);
        setPendingOffer(offer);
    }, []);

    const getPurchaseButton = useCallback(() =>
    {
        if(!pendingOffer) return null;

        if(pendingOffer.priceCredits > getCurrencyAmount(-1))
        {
            return <Button fullWidth variant="danger">{ LocalizeText('catalog.alert.notenough.title') }</Button>;
        }

        if(pendingOffer.priceActivityPoints > getCurrencyAmount(pendingOffer.priceActivityPointsType))
        {
            return <Button fullWidth variant="danger">{ LocalizeText('catalog.alert.notenough.activitypoints.title.' + pendingOffer.priceActivityPointsType) }</Button>;
        }

        switch(purchaseState)
        {
            case CatalogPurchaseState.CONFIRM:
                return <Button fullWidth variant="warning" onClick={ purchaseSubscription }>{ LocalizeText('catalog.marketplace.confirm_title') }</Button>;
            case CatalogPurchaseState.PURCHASE:
                return <Button disabled fullWidth variant="primary"><LayoutLoadingSpinnerView /></Button>;
            case CatalogPurchaseState.FAILED:
                return <Button disabled fullWidth variant="danger">{ LocalizeText('generic.failed') }</Button>;
            case CatalogPurchaseState.NONE:
            default:
                return <Button fullWidth variant="success" onClick={ () => setPurchaseState(CatalogPurchaseState.CONFIRM) }>{ LocalizeText('buy') }</Button>;
        }
    }, [ pendingOffer, purchaseState, purchaseSubscription, getCurrencyAmount ]);

    useEffect(() =>
    {
        if(!clubOffers) SendMessageComposer(new GetClubOffersMessageComposer(1));
    }, [ clubOffers ]);

    return (
        <Grid>
            <Column fullHeight justifyContent="between" overflow="hidden" size={ 7 }>
                <AutoGrid className="nitro-catalog-layout-vip-buy-grid" columnCount={ 1 }>
                    { clubOffers && (clubOffers.length > 0) && clubOffers.map((offer, index) =>
                    {
                        return (
                            <LayoutGridItem key={ index } alignItems="center" center={ false } className="p-1" column={ false } itemActive={ pendingOffer === offer } justifyContent="between" onClick={ () => setOffer(offer) }>
                                <i className="icon-hc-banner" />
                                <Column gap={ 0 } justifyContent="end">
                                    <Text textEnd>{ getOfferText(offer) }</Text>
                                    <Flex gap={ 1 } justifyContent="end">
                                        { (offer.priceCredits > 0) &&
                                        <Flex alignItems="center" gap={ 1 } justifyContent="end">
                                            <Text>{ offer.priceCredits }</Text>
                                            <LayoutCurrencyIcon type={ -1 } />
                                        </Flex> }
                                        { (offer.priceActivityPoints > 0) &&
                                        <Flex alignItems="center" gap={ 1 } justifyContent="end">
                                            <Text>{ offer.priceActivityPoints }</Text>
                                            <LayoutCurrencyIcon type={ offer.priceActivityPointsType } />
                                        </Flex> }
                                    </Flex>
                                </Column>
                            </LayoutGridItem>
                        );
                    }) }
                </AutoGrid>
                <Text center dangerouslySetInnerHTML={ { __html: LocalizeText('catalog.vip.buy.hccenter') } }></Text>
            </Column>
            <Column overflow="hidden" size={ 5 }>
                <Column center fullHeight overflow="hidden">
                    { currentPage.localization.getImage(1) && <img alt="" src={ currentPage.localization.getImage(1) } /> }
                    <Text center dangerouslySetInnerHTML={ { __html: getSubscriptionDetails } } overflow="auto" />
                </Column>
                { pendingOffer &&
                    <Column fullWidth grow justifyContent="end">
                        <Flex alignItems="end">
                            <Column grow gap={ 0 }>
                                <Text fontWeight="bold">{ getPurchaseHeader() }</Text>
                                <Text>{ getPurchaseValidUntil() }</Text>
                            </Column>
                            <div className="flex flex-col gap-1">
                                { (pendingOffer.priceCredits > 0) &&
                                    <Flex alignItems="center" gap={ 1 } justifyContent="end">
                                        <Text>{ pendingOffer.priceCredits }</Text>
                                        <LayoutCurrencyIcon type={ -1 } />
                                    </Flex> }
                                { (pendingOffer.priceActivityPoints > 0) &&
                                    <Flex alignItems="center" gap={ 1 } justifyContent="end">
                                        <Text>{ pendingOffer.priceActivityPoints }</Text>
                                        <LayoutCurrencyIcon type={ pendingOffer.priceActivityPointsType } />
                                    </Flex> }
                            </div>
                        </Flex>
                        { getPurchaseButton() }
                    </Column> }
            </Column>
        </Grid>
    );
};
