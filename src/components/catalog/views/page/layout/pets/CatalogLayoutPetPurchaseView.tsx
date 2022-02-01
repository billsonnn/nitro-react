import { ApproveNameMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { LocalizeText } from '../../../../../../api';
import { Column } from '../../../../../../common/Column';
import { Flex } from '../../../../../../common/Flex';
import { Text } from '../../../../../../common/Text';
import { CatalogPurchasedEvent } from '../../../../../../events';
import { useUiEvent } from '../../../../../../hooks/events/ui/ui-event';
import { SendMessageHook } from '../../../../../../hooks/messages/message-event';
import { CurrencyIcon } from '../../../../../../views/shared/currency-icon/CurrencyIcon';
import { IPurchasableOffer } from '../../../../common/IPurchasableOffer';
import { Offer } from '../../../../common/Offer';
import { CatalogPurchaseWidgetView } from '../../widgets/CatalogPurchaseWidgetView';
import { CatalogPetNameApprovalView } from './CatalogPetNameApprovalView';

export interface CatalogLayoutPetPurchaseViewProps
{
    offer: IPurchasableOffer;
    pageId: number;
    extra?: string;
}

export const CatalogLayoutPetPurchaseView: FC<CatalogLayoutPetPurchaseViewProps> = props =>
{
    const { offer = null, pageId = -1, extra = '' } = props;
    const [ petNameValue, setPetNameValue ] = useState('');
    const [ nameApproved, setNameApproved ] = useState(false);

    const onCatalogPurchasedEvent = useCallback((event: CatalogPurchasedEvent) =>
    {
        setNameApproved(false);
    }, []);

    useUiEvent(CatalogPurchasedEvent.PURCHASE_SUCCESS, onCatalogPurchasedEvent);

    const beforePurchase = useCallback(() =>
    {
        SendMessageHook(new ApproveNameMessageComposer(petNameValue, 1));
    }, [ petNameValue ]);

    const extraData = `${ petNameValue }\n${ extra }`;
    
    return (
        <Column fullWidth grow justifyContent="end">
            <div className="d-flex flex-grow-1 justify-content-center align-items-center">
                <CatalogPetNameApprovalView petNameValue={ petNameValue } setPetNameValue={ setPetNameValue } nameApproved={ nameApproved } setNameApproved={ setNameApproved } />
            </div>
            <Flex alignItems="end">
                <div className="flex-grow-1 align-items-end">
                    <Text>{ LocalizeText('catalog.bundlewidget.price') }</Text>
                </div>
                <Column gap={ 1 }>
                    { ((offer.priceType === Offer.PRICE_TYPE_CREDITS_ACTIVITYPOINTS) || (offer.priceType === Offer.PRICE_TYPE_CREDITS)) &&
                        <Flex alignItems="center" justifyContent="end" gap={ 1 }>
                            <Text>{ offer.priceInCredits }</Text>
                            <CurrencyIcon type={ -1 } />
                        </Flex> }
                    { ((offer.priceType === Offer.PRICE_TYPE_CREDITS_ACTIVITYPOINTS) || (offer.priceType === Offer.PRICE_TYPE_ACTIVITYPOINTS)) &&
                        <Flex alignItems="center" justifyContent="end" gap={ 1 }>
                            <Text>{ offer.priceInActivityPoints }</Text>
                            <CurrencyIcon type={ offer.activityPointType } />
                        </Flex> }
                </Column>
            </Flex>
            <Column gap={ 1 }>
                <CatalogPurchaseWidgetView />
                {/* <CatalogPurchaseButtonView offer={ offer } pageId={ pageId } extra={ extraData } quantity={ 1 } isPurchaseAllowed={ nameApproved } beforePurchase={ beforePurchase } />
                { offer.giftable &&
                    <CatalogPurchaseGiftButtonView offer={ offer } pageId={ pageId } extra={ extraData } disabled={ nameApproved } /> } */}
            </Column>
        </Column>
    );
}
