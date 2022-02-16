import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC } from 'react';
import { LocalizeText } from '../../../../../api';
import { Flex } from '../../../../../common/Flex';
import { Text } from '../../../../../common/Text';
import { useCatalogContext } from '../../../CatalogContext';

const MIN_VALUE: number = 1;
const MAX_VALUE: number = 100;

export const CatalogSpinnerWidgetView: FC<{}> = props =>
{
    const { currentOffer = null, purchaseOptions = null, setPurchaseOptions = null } = useCatalogContext();
    const { quantity = 1 } = purchaseOptions;

    const updateQuantity = (value: number) =>
    {
        if(isNaN(value)) value = 1;

        value = Math.max(value, MIN_VALUE);
        value = Math.min(value, MAX_VALUE);

        if(value === quantity) return;

        setPurchaseOptions(prevValue =>
            {
                const quantity = value;

                return { ...prevValue, quantity };
            });
    }

    if(!currentOffer || !currentOffer.bundlePurchaseAllowed) return null;

    return (
        <>
            <Text>{ LocalizeText('catalog.bundlewidget.spinner.select.amount') }</Text>
            <Flex alignItems="center" gap={ 1 }>
                <FontAwesomeIcon icon="caret-left" className="text-black cursor-pointer" onClick={ event => updateQuantity(quantity - 1) } />
                <input type="number" className="form-control form-control-sm quantity-input" value={ quantity } onChange={ event => updateQuantity(event.target.valueAsNumber)} />
                <FontAwesomeIcon icon="caret-right" className="text-black cursor-pointer" onClick={ event => updateQuantity(quantity + 1) } />
            </Flex>
        </>
    );
}
