import { FC } from 'react';
import { useInventoryContext } from '../../context/InventoryContext';
import { InventoryTabPetsViewProps } from './InventoryTabPetsView.types';

export const InventoryTabPetsView: FC<InventoryTabPetsViewProps> = props =>
{
    const inventoryContext = useInventoryContext();

    return (
        <>Pets content</>
    );
}
