import { FC } from 'react';
import { useInventoryContext } from '../../context/InventoryContext';
import { InventoryTabBotsViewProps } from './InventoryTabBotsView.types';

export const InventoryTabBotsView: FC<InventoryTabBotsViewProps> = props =>
{
    const inventoryContext = useInventoryContext();

    return (
        <>Bots content</>
    );
}
