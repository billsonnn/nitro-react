import { FC, useState } from 'react';
import { CurrencyIcon } from '../../../../../../../utils/currency-icon/CurrencyIcon';
import { LocalizeText } from '../../../../../../../utils/LocalizeText';
import { CatalogPurchaseButtonView } from '../../../purchase/purchase-button/CatalogPurchaseButtonView';
import { CatalogPetNameApprovalView } from '../name-approval/CatalogPetNameApprovalView';
import { CatalogLayoutPetPurchaseViewProps } from './CatalogLayoutPetPurchaseView.types';

export const CatalogLayoutPetPurchaseView: FC<CatalogLayoutPetPurchaseViewProps> = props =>
{
    const { offer = null, pageId = -1, extra = '' } = props;
    const [ petNameValue, setPetNameValue ] = useState('');

    const extraData = ((extra && extra.length) ? extra : (offer?.products[0]?.extraParam || null));
    
    return (
        <>
            <div className="d-flex flex-grow-1 justify-content-center align-items-center">
                <CatalogPetNameApprovalView petNameValue={ petNameValue } setPetNameValue={ setPetNameValue } />
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
                    <CatalogPurchaseButtonView className="btn-sm w-100" offer={ offer } pageId={ pageId } extra={ extraData } quantity={ 1 } />
                </div>
            </div>
        </>
    );
}
