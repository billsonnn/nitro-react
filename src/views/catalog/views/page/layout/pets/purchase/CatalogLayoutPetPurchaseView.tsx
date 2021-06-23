import { ApproveNameMessageComposer } from 'nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { CatalogEvent } from '../../../../../../../events';
import { useUiEvent } from '../../../../../../../hooks/events/ui/ui-event';
import { SendMessageHook } from '../../../../../../../hooks/messages/message-event';
import { LocalizeText } from '../../../../../../../utils/LocalizeText';
import { CurrencyIcon } from '../../../../../../shared/currency-icon/CurrencyIcon';
import { CatalogPurchaseButtonView } from '../../../purchase/purchase-button/CatalogPurchaseButtonView';
import { CatalogPetNameApprovalView } from '../name-approval/CatalogPetNameApprovalView';
import { CatalogLayoutPetPurchaseViewProps } from './CatalogLayoutPetPurchaseView.types';

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
        <>
            <div className="d-flex flex-grow-1 justify-content-center align-items-center">
                <CatalogPetNameApprovalView petNameValue={ petNameValue } setPetNameValue={ setPetNameValue } nameApproved={ nameApproved } setNameApproved={ setNameApproved } />
            </div>
            <div className="d-flex flex-column flex-grow-1 justify-content-end w-100">
                <div className="d-flex align-items-end">
                    <div className="flex-grow-1 align-items-end">
                        <span className="text-black">{ LocalizeText('catalog.bundlewidget.price') }</span>
                    </div>
                    <div className="d-flex flex-column">
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
                <div className="d-flex flex-column mt-1">
                    <CatalogPurchaseButtonView className="btn-sm w-100" offer={ offer } pageId={ pageId } extra={ extraData } quantity={ 1 } isPurchaseAllowed={ nameApproved } beforePurchase={ beforePurchase } />
                </div>
            </div>
        </>
    );
}
