import { FC } from 'react';
import { useInventoryContext } from '../../context/InventoryContext';
import { InventoryTabFurnitureViewProps } from './InventoryTabFurnitureView.types';

export const InventoryTabFurnitureView: FC<InventoryTabFurnitureViewProps> = props =>
{
    const inventoryContext = useInventoryContext();

    return (
        <>Furniture content</>
    );
}
