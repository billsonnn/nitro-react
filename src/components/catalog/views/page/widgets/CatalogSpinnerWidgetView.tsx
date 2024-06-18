import { FC } from 'react';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';
import { LocalizeText } from '../../../../../api';
import { Text } from '../../../../../common';
import { useCatalog } from '../../../../../hooks';

const MIN_VALUE: number = 1;
const MAX_VALUE: number = 100;

export const CatalogSpinnerWidgetView: FC<{}> = props =>
{
    const { currentOffer = null, purchaseOptions = null, setPurchaseOptions = null } = useCatalog();
    const { quantity = 1 } = purchaseOptions;

    const updateQuantity = (value: number) =>
    {
        if(isNaN(value)) value = 1;

        value = Math.max(value, MIN_VALUE);
        value = Math.min(value, MAX_VALUE);

        if(value === quantity) return;

        setPurchaseOptions(prevValue =>
        {
            const newValue = { ...prevValue };

            newValue.quantity = value;

            return newValue;
        });
    };

    if(!currentOffer || !currentOffer.bundlePurchaseAllowed) return null;

    return (
        <>
            <Text>{ LocalizeText('catalog.bundlewidget.spinner.select.amount') }</Text>
            <div className="flex items-center gap-1">
                <FaCaretLeft className="text-black cursor-pointer fa-icon" onClick={ event => updateQuantity(quantity - 1) } />
                <input className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none min-h-[17px] h-[17px] w-[28px] px-[4px] py-[0] text-right  rounded-[.2rem]" type="number" value={ quantity } onChange={ event => updateQuantity(event.target.valueAsNumber) } />
                <FaCaretRight className="text-black cursor-pointer fa-icon" onClick={ event => updateQuantity(quantity + 1) } />
            </div>
        </>
    );
};
