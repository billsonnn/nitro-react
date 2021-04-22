import { FC, useContext } from 'react';
import { InventoryContext } from '../../InventoryView';
import { InventoryTabBotsViewProps } from './InventoryTabBotsView.types';

export const InventoryTabBotsView: FC<InventoryTabBotsViewProps> = props =>
{
    const inventoryContext = useContext(InventoryContext);

    return (
        <></>
    );
}
