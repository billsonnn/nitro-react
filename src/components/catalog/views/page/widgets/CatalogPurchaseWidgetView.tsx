import { IObjectData } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { LocalizeText } from '../../../../../api';
import { Button } from '../../../../../common/Button';
import { CatalogSelectProductEvent, CatalogSetExtraPurchaseParameterEvent } from '../../../../../events';
import { CatalogInitPurchaseEvent } from '../../../../../events/catalog/CatalogInitPurchaseEvent';
import { CatalogPurchaseOverrideEvent } from '../../../../../events/catalog/CatalogPurchaseOverrideEvent';
import { CatalogSetRoomPreviewerStuffDataEvent } from '../../../../../events/catalog/CatalogSetRoomPreviewerStuffDataEvent';
import { CatalogWidgetEvent } from '../../../../../events/catalog/CatalogWidgetEvent';
import { useUiEvent } from '../../../../../hooks';
import { IPurchasableOffer } from '../../../common/IPurchasableOffer';
import { Offer } from '../../../common/Offer';

interface CatalogPurchaseWidgetViewProps
{
    noGiftOption?: boolean;
}

export const CatalogPurchaseWidgetView: FC<CatalogPurchaseWidgetViewProps> = props =>
{
    const { noGiftOption = false } = props;
    const [ offer, setOffer ] = useState<IPurchasableOffer>(null);
    const [ quantity, setQuantity ] = useState(1);
    const [ extraData, setExtraData ] = useState<string>('');
    const [ extraParamRequired, setExtraParamRequired ] = useState(false);
    const [ giftEnabled, setGiftEnabled ] = useState(false);
    const [ purchaseCallback, setPurchaseCallback ] = useState<Function>(null);
    const [ previewStuffData, setPreviewStuffData ] = useState<IObjectData>(null);
    const [ purchaseWillBeGift, setPurchaseWillBeGift ] = useState(false);

    const onCatalogSelectProductEvent = useCallback((event: CatalogSelectProductEvent) =>
    {
        setOffer(event.offer);
    }, []);

    useUiEvent(CatalogWidgetEvent.SELECT_PRODUCT, onCatalogSelectProductEvent);

    const onCatalogSetExtraPurchaseParameterEvent = useCallback((event: CatalogSetExtraPurchaseParameterEvent) =>
    {
        setExtraData(event.parameter);
        setGiftEnabled(offer && offer.giftable);
    }, [ offer ]);

    useUiEvent(CatalogWidgetEvent.SET_EXTRA_PARM, onCatalogSetExtraPurchaseParameterEvent);

    const onCatalogPurchaseOverrideEvent = useCallback((event: CatalogPurchaseOverrideEvent) =>
    {
        setPurchaseCallback(event.callback);
    }, []);

    useUiEvent(CatalogWidgetEvent.PURCHASE_OVERRIDE, onCatalogPurchaseOverrideEvent);

    const onCatalogInitPurchaseEvent = useCallback((event: CatalogInitPurchaseEvent) =>
    {
        if(!offer) return;

        // show purchase confirmation
        // offer, page.pageId, extraData, quantity, previewStuffData, null, true, null
    }, [ offer ]);

    useUiEvent(CatalogWidgetEvent.INIT_PURCHASE, onCatalogInitPurchaseEvent);

    const onCatalogSetRoomPreviewerStuffDataEvent = useCallback((event: CatalogSetRoomPreviewerStuffDataEvent) =>
    {
        setPreviewStuffData(event.stuffData);
    }, []);

    useUiEvent(CatalogWidgetEvent.SET_PREVIEWER_STUFFDATA, onCatalogSetRoomPreviewerStuffDataEvent);

    const onCatalogWidgetEvent = useCallback((event: CatalogWidgetEvent) =>
    {
        setExtraParamRequired(true);
    }, []);

    useUiEvent(CatalogWidgetEvent.EXTRA_PARAM_REQUIRED_FOR_BUY, onCatalogWidgetEvent);

    const isLimitedSoldOut = useMemo(() =>
    {
        if(!offer) return false;
        
        if(extraParamRequired && (!extraData || !extraData.length)) return false;

        if(offer.pricingModel === Offer.PRICING_MODEL_SINGLE)
        {
            const product = offer.product;

            if(product && product.isUniqueLimitedItem) return !product.uniqueLimitedItemsLeft;
        }

        return false;
    }, [ offer, extraParamRequired, extraData ]);

    const purchase = useCallback((isGift: boolean = false) =>
    {

    }, []);

    useEffect(() =>
    {
        setQuantity(1);
        setPurchaseWillBeGift(false);
    }, [ offer ]);

    if(!offer) return null;

    const getPurchaseButton = () =>
    {
        const priceCredits = (offer.priceInCredits * quantity);
        const pricePoints = (offer.priceInActivityPoints * quantity);
    }

    return (
        <>
            <Button disabled={ (isLimitedSoldOut || (extraParamRequired && (!extraData || !extraData.length))) }>
                { LocalizeText('catalog.purchase_confirmation.' + (offer.isRentOffer ? 'rent' : 'buy')) }
            </Button>
            { (!noGiftOption && !offer.isRentOffer) &&
                <Button disabled={ ((quantity > 1) || !offer.giftable || isLimitedSoldOut || (extraParamRequired && (!extraData || !extraData.length))) }>
                        { LocalizeText('catalog.purchase_confirmation.gift') }
                    </Button> }
        </>
    );
}
