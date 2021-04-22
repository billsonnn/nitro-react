import classNames from 'classnames';
import { FC, useContext } from 'react';
import { LocalizeText } from '../../../../utils/LocalizeText';
import { InventoryContext } from '../../InventoryView';
import { InventoryTabViewProps } from './InventoryTabView.types';

export const InventoryTabView: FC<InventoryTabViewProps> = props =>
{
    const inventoryContext = useContext(InventoryContext);

    return (
        <button type="button" 
        className={ 'btn btn-secondary btn-sm ' + classNames({ 'active': inventoryContext.currentTab === props.tab })}
        onClick={ () => inventoryContext.onSetCurrentTab(props.tab) }>
            { LocalizeText(props.tab) }
        </button>
    );
}
