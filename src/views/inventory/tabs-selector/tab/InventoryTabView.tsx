import classNames from 'classnames';
import { FC, MouseEvent } from 'react';
import { LocalizeText } from '../../../../utils/LocalizeText';
import { useInventoryContext } from '../../context/InventoryContext';
import { InventoryTabViewProps } from './InventoryTabView.types';

export const InventoryTabView: FC<InventoryTabViewProps> = props =>
{
    const { tab = null } = props;

    const inventoryContext = useInventoryContext();

    function selectTab(event: MouseEvent = null): void
    {
        inventoryContext.setCurrentTab(tab);
    }

    if(!tab) return null;

    return <button type="button" className={ 'btn btn-secondary btn-sm ' + classNames({ 'active': (inventoryContext.currentTab === tab) })} onClick={ selectTab }>{ LocalizeText(tab) }</button>;
}
