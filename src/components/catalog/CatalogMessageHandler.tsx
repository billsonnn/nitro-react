import { ApproveNameMessageEvent, CatalogPageMessageEvent, CatalogPagesListEvent, CatalogPublishedMessageEvent, ClubGiftInfoEvent, GiftReceiverNotFoundEvent, GiftWrappingConfigurationEvent, HabboClubOffersMessageEvent, LimitedEditionSoldOutEvent, MarketplaceConfigurationEvent, MarketplaceMakeOfferResult, NodeData, ProductOfferEvent, PurchaseErrorMessageEvent, PurchaseNotAllowedMessageEvent, PurchaseOKMessageEvent, SellablePetPalettesMessageEvent, UserSubscriptionEvent } from '@nitrots/nitro-renderer';
import { GuildMembershipsMessageEvent } from '@nitrots/nitro-renderer/src/nitro/communication/messages/incoming/user/GuildMembershipsMessageEvent';
import { FC, useCallback } from 'react';
import { GetFurnitureData, GetProductDataForLocalization, LocalizeText } from '../../api';
import { CatalogNameResultEvent, CatalogPurchaseFailureEvent, CatalogPurchaseNotAllowedEvent, CatalogSetExtraPurchaseParameterEvent } from '../../events';
import { CatalogGiftReceiverNotFoundEvent } from '../../events/catalog/CatalogGiftReceiverNotFoundEvent';
import { CatalogPurchasedEvent } from '../../events/catalog/CatalogPurchasedEvent';
import { CatalogPurchaseSoldOutEvent } from '../../events/catalog/CatalogPurchaseSoldOutEvent';
import { BatchUpdates } from '../../hooks';
import { dispatchUiEvent } from '../../hooks/events/ui/ui-event';
import { CreateMessageHook } from '../../hooks/messages/message-event';
import { NotificationAlertType } from '../../views/notification-center/common/NotificationAlertType';
import { NotificationUtilities } from '../../views/notification-center/common/NotificationUtilities';
import { useCatalogContext } from './CatalogContext';
import { CatalogNode } from './common/CatalogNode';
import { CatalogPetPalette } from './common/CatalogPetPalette';
import { CatalogType } from './common/CatalogType';
import { GiftWrappingConfiguration } from './common/GiftWrappingConfiguration';
import { ICatalogNode } from './common/ICatalogNode';
import { IProduct } from './common/IProduct';
import { IPurchasableOffer } from './common/IPurchasableOffer';
import { Offer } from './common/Offer';
import { PageLocalization } from './common/PageLocalization';
import { Product } from './common/Product';
import { ProductTypeEnum } from './common/ProductTypeEnum';
import { SubscriptionInfo } from './common/SubscriptionInfo';

export const CatalogMessageHandler: FC<{}> = props =>
{
    const { setIsBusy, pageId, currentType, setRootNode, setOffersToNodes, currentPage, setCurrentOffer, setFrontPageItems, resetState, showCatalogPage, setCatalogOptions = null } = useCatalogContext();

    const onCatalogPagesListEvent = useCallback((event: CatalogPagesListEvent) =>
    {
        const parser = event.getParser();
        const offers: Map<number, ICatalogNode[]> = new Map();

        const getCatalogNode = (node: NodeData, depth: number, parent: ICatalogNode) =>
        {
            const catalogNode = (new CatalogNode(node, depth, parent) as ICatalogNode);

            for(const offerId of catalogNode.offerIds)
            {
                if(offers.has(offerId)) offers.get(offerId).push(catalogNode);
                else offers.set(offerId, [ catalogNode ]);
            }

            depth++;

            for(const child of node.children) catalogNode.addChild(getCatalogNode(child, depth, catalogNode));

            return catalogNode;
        }

        BatchUpdates(() =>
        {
            setRootNode(getCatalogNode(parser.root, 0, null));
            setOffersToNodes(offers);
        });
    }, [ setRootNode, setOffersToNodes ]);

    const onCatalogPageMessageEvent = useCallback((event: CatalogPageMessageEvent) =>
    {
        const parser = event.getParser();

        if(parser.catalogType !== currentType) return;

        const purchasableOffers: IPurchasableOffer[] = [];

        for(const offer of parser.offers)
        {
            const products: IProduct[] = [];
            const productData = GetProductDataForLocalization(offer.localizationId);

            for(const product of offer.products)
            {
                const furnitureData = GetFurnitureData(product.furniClassId, product.productType);

                products.push(new Product(product.productType, product.furniClassId, product.extraParam, product.productCount, productData, furnitureData, product.uniqueLimitedItem, product.uniqueLimitedSeriesSize, product.uniqueLimitedItemsLeft));
            }

            if(!products.length) continue;

            const purchasableOffer = new Offer(offer.offerId, offer.localizationId, offer.rent, offer.priceCredits, offer.priceActivityPoints, offer.priceActivityPointsType, offer.giftable, offer.clubLevel, products, offer.bundlePurchaseAllowed);

            if((currentType === CatalogType.NORMAL) || ((purchasableOffer.pricingModel !== Offer.PRICING_MODEL_BUNDLE) && (purchasableOffer.pricingModel !== Offer.PRICING_MODEL_MULTI))) purchasableOffers.push(purchasableOffer);
        }

        BatchUpdates(() =>
        {
            if(parser.frontPageItems && parser.frontPageItems.length) setFrontPageItems(parser.frontPageItems);

            setIsBusy(false);

            if(pageId === parser.pageId)
            {
                showCatalogPage(parser.pageId, parser.layoutCode, new PageLocalization(parser.localization.images.concat(), parser.localization.texts.concat()), purchasableOffers, parser.offerId, parser.acceptSeasonCurrencyAsCredits);
            }
        });
    }, [ currentType, pageId, setFrontPageItems, setIsBusy, showCatalogPage ]);

    const onPurchaseOKMessageEvent = useCallback((event: PurchaseOKMessageEvent) =>
    {
        const parser = event.getParser();

        dispatchUiEvent(new CatalogPurchasedEvent(parser.offer));
    }, []);

    const onPurchaseErrorMessageEvent = useCallback((event: PurchaseErrorMessageEvent) =>
    {
        const parser = event.getParser();

        dispatchUiEvent(new CatalogPurchaseFailureEvent(parser.code));
    }, []);

    const onPurchaseNotAllowedMessageEvent = useCallback((event: PurchaseNotAllowedMessageEvent) =>
    {
        const parser = event.getParser();

        dispatchUiEvent(new CatalogPurchaseNotAllowedEvent(parser.code));
    }, []);

    const onLimitedEditionSoldOutEvent = useCallback((event: LimitedEditionSoldOutEvent) =>
    {
        const parser = event.getParser();

        dispatchUiEvent(new CatalogPurchaseSoldOutEvent());
    }, []);

    const onProductOfferEvent = useCallback((event: ProductOfferEvent) =>
    {
        const parser = event.getParser();
        const offerData = parser.offer;

        if(!offerData || !offerData.products.length) return;

        const offerProductData = offerData.products[0];

        if(offerProductData.uniqueLimitedItem)
        {
            // update unique
        }

        const products: IProduct[] = [];
        const productData = GetProductDataForLocalization(offerData.localizationId);

        for(const product of offerData.products)
        {
            const furnitureData = GetFurnitureData(product.furniClassId, product.productType);

            products.push(new Product(product.productType, product.furniClassId, product.extraParam, product.productCount, productData, furnitureData, product.uniqueLimitedItem, product.uniqueLimitedSeriesSize, product.uniqueLimitedItemsLeft));
        }

        const offer = new Offer(offerData.offerId, offerData.localizationId, offerData.rent, offerData.priceCredits, offerData.priceActivityPoints, offerData.priceActivityPointsType, offerData.giftable, offerData.clubLevel, products, offerData.bundlePurchaseAllowed);

        if(!((currentType === CatalogType.NORMAL) || ((offer.pricingModel !== Offer.PRICING_MODEL_BUNDLE) && (offer.pricingModel !== Offer.PRICING_MODEL_MULTI)))) return;

        offer.page = currentPage;

        setCurrentOffer(offer);

        if(offer.product && (offer.product.productType === ProductTypeEnum.WALL))
        {
            dispatchUiEvent(new CatalogSetExtraPurchaseParameterEvent(offer.product.extraParam));
        }

        // (this._isObjectMoverRequested) && (this._purchasableOffer)
    }, [ currentType, currentPage, setCurrentOffer ]);

    const onSellablePetPalettesMessageEvent = useCallback((event: SellablePetPalettesMessageEvent) =>
    {
        const parser = event.getParser();
        const petPalette = new CatalogPetPalette(parser.productCode, parser.palettes.slice());

        setCatalogOptions(prevValue =>
            {
                const petPalettes = [];

                if(prevValue.petPalettes) petPalettes.push(...prevValue.petPalettes);

                for(let i = 0; i < petPalettes.length; i++)
                {
                    const palette = petPalettes[i];

                    if(palette.breed === petPalette.breed)
                    {
                        petPalettes.splice(i, 1);

                        break;
                    }
                }
                
                petPalettes.push(petPalette);

                return { ...prevValue, petPalettes };
            });
    }, [ setCatalogOptions ]);

    const onApproveNameMessageEvent = useCallback((event: ApproveNameMessageEvent) =>
    {
        const parser = event.getParser();

        dispatchUiEvent(new CatalogNameResultEvent(parser.result, parser.validationInfo));
    }, []);

    const onGiftReceiverNotFoundEvent = useCallback(() =>
    {
        dispatchUiEvent(new CatalogGiftReceiverNotFoundEvent());
    }, []);

    const onHabboClubOffersMessageEvent = useCallback((event: HabboClubOffersMessageEvent) =>
    {
        const parser = event.getParser();

        setCatalogOptions(prevValue =>
            {
                const clubOffers = parser.offers;

                return { ...prevValue, clubOffers };
            });
    }, [ setCatalogOptions ]);

    const onGuildMembershipsMessageEvent = useCallback((event: GuildMembershipsMessageEvent) =>
    {
        const parser = event.getParser();

        setCatalogOptions(prevValue =>
            {
                const groups = parser.groups;

                return { ...prevValue, groups };
            });
    }, [ setCatalogOptions ]);

    const onUserSubscriptionEvent = useCallback((event: UserSubscriptionEvent) =>
    {
        const parser = event.getParser();

        setCatalogOptions(prevValue =>
            {
                const subscriptionInfo = new SubscriptionInfo(
                    Math.max(0, parser.daysToPeriodEnd),
                    Math.max(0, parser.periodsSubscribedAhead),
                    parser.isVip,
                    parser.pastClubDays,
                    parser.pastVipDays);

                return { ...prevValue, subscriptionInfo };
            });
    }, [ setCatalogOptions ]);

    const onCatalogPublishedMessageEvent = useCallback((event: CatalogPublishedMessageEvent) =>
    {
        resetState();
    }, [ resetState ]);

    const onGiftWrappingConfigurationEvent = useCallback((event: GiftWrappingConfigurationEvent) =>
    {
        const parser = event.getParser();

        setCatalogOptions(prevValue =>
            {
                const giftConfiguration = new GiftWrappingConfiguration(parser);

                return { ...prevValue, giftConfiguration };
            });
    }, [ setCatalogOptions ]);

    const onMarketplaceMakeOfferResult = useCallback((event: MarketplaceMakeOfferResult) =>
    {
        const parser = event.getParser();

        if(!parser) return;

        let title = '';
        if(parser.result === 1)
        {
            title = LocalizeText('inventory.marketplace.result.title.success');
        }
        else
        {
            title = LocalizeText('inventory.marketplace.result.title.failure');
        }

        const message = LocalizeText(`inventory.marketplace.result.${parser.result}`);
        
        NotificationUtilities.simpleAlert(message, NotificationAlertType.DEFAULT, null, null, title);
    }, []);

    const onMarketplaceConfigurationEvent = useCallback((event: MarketplaceConfigurationEvent) =>
    {
        const parser = event.getParser();

        setCatalogOptions(prevValue =>
            {
                const marketplaceConfiguration = parser;

                return { ...prevValue, marketplaceConfiguration };
            });
    }, [ setCatalogOptions ]);

    const onClubGiftInfoEvent = useCallback((event: ClubGiftInfoEvent) =>
    {
        const parser = event.getParser();

        setCatalogOptions(prevValue =>
            {
                const clubGifts = parser;

                return { ...prevValue, clubGifts };
            });
    }, [ setCatalogOptions ]);

    CreateMessageHook(CatalogPagesListEvent, onCatalogPagesListEvent);
    CreateMessageHook(CatalogPageMessageEvent, onCatalogPageMessageEvent);
    CreateMessageHook(PurchaseOKMessageEvent, onPurchaseOKMessageEvent);
    CreateMessageHook(PurchaseErrorMessageEvent, onPurchaseErrorMessageEvent);
    CreateMessageHook(PurchaseNotAllowedMessageEvent, onPurchaseNotAllowedMessageEvent);
    CreateMessageHook(LimitedEditionSoldOutEvent, onLimitedEditionSoldOutEvent);
    CreateMessageHook(ProductOfferEvent, onProductOfferEvent);
    CreateMessageHook(GuildMembershipsMessageEvent, onGuildMembershipsMessageEvent);
    CreateMessageHook(SellablePetPalettesMessageEvent, onSellablePetPalettesMessageEvent);
    CreateMessageHook(ApproveNameMessageEvent, onApproveNameMessageEvent);
    CreateMessageHook(GiftReceiverNotFoundEvent, onGiftReceiverNotFoundEvent);
    CreateMessageHook(HabboClubOffersMessageEvent, onHabboClubOffersMessageEvent);
    CreateMessageHook(UserSubscriptionEvent, onUserSubscriptionEvent);
    CreateMessageHook(CatalogPublishedMessageEvent, onCatalogPublishedMessageEvent);
    CreateMessageHook(GiftWrappingConfigurationEvent, onGiftWrappingConfigurationEvent);
    CreateMessageHook(ClubGiftInfoEvent, onClubGiftInfoEvent);
    CreateMessageHook(MarketplaceMakeOfferResult, onMarketplaceMakeOfferResult);
    CreateMessageHook(MarketplaceConfigurationEvent, onMarketplaceConfigurationEvent);

    return null;
}
