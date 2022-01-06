import { ApproveNameMessageComposer, CatalogPageMessageOfferData } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { LocalizeText } from '../../../../../../api';
import { Column } from '../../../../../../common/Column';
import { Flex } from '../../../../../../common/Flex';
import { Text } from '../../../../../../common/Text';
import { CatalogEvent } from '../../../../../../events';
import { useUiEvent } from '../../../../../../hooks/events/ui/ui-event';
import { SendMessageHook } from '../../../../../../hooks/messages/message-event';
import { CurrencyIcon } from '../../../../../../views/shared/currency-icon/CurrencyIcon';
import { CatalogPurchaseButtonView } from '../../purchase/CatalogPurchaseButtonView';
import { CatalogPurchaseGiftButtonView } from '../../purchase/CatalogPurchaseGiftButtonView';
import { CatalogPetNameApprovalView } from './CatalogPetNameApprovalView';

export interface CatalogLayoutPetPurchaseViewProps
{
    offer: CatalogPageMessageOfferData;
    pageId: number;
    extra?: string;
}

export const CatalogLayoutPetPurchaseView: FC<CatalogLayoutPetPurchaseViewProps> = props =>
{
    const { offer = null, pageId = -1, extra = '' } = props;
    const [ petNameValue, setPetNameValue ] = useState('');
    const [ nameApproved, setNameApproved ] = useState(false);

    const onCatalogEvent = useCallback((event: CatalogEvent) =>
    {
        switch(event.type)
        {
            case CatalogEvent.PURCHASE_SUCCESS:
                setNameApproved(false);
                return;
        }
    }, []);

    useUiEvent(CatalogEvent.PURCHASE_SUCCESS, onCatalogEvent);

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
                <Column>
                    { (offer.priceCredits > 0) &&
                        <Flex alignItems="center" justifyContent="end" gap={ 1 }>
                            <Text>{ offer.priceCredits }</Text>
                            <CurrencyIcon type={ -1 } />
                        </Flex> }
                    { (offer.priceActivityPoints > 0) &&
                        <Flex alignItems="center" justifyContent="end" gap={ 1 }>
                            <Text>{ offer.priceActivityPoints }</Text>
                            <CurrencyIcon type={ offer.priceActivityPointsType } />
                        </Flex> }
                </Column>
            </Flex>
            <Column gap={ 1 }>
                <CatalogPurchaseButtonView className="btn-sm w-100" offer={ offer } pageId={ pageId } extra={ extraData } quantity={ 1 } isPurchaseAllowed={ nameApproved } beforePurchase={ beforePurchase } />
                { offer.giftable && <CatalogPurchaseGiftButtonView className="btn-sm w-100 mt-1" offer={ offer } pageId={ pageId } extra={ extraData } disabled={ nameApproved } /> }
            </Column>
        </Column>
    );
}
