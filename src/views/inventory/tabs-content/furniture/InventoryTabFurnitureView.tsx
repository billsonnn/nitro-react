import { FC, useContext } from 'react';
import { InventoryContext } from '../../InventoryView';
import { InventoryTabFurnitureViewProps } from './InventoryTabFurnitureView.types';

export const InventoryTabFurnitureView: FC<InventoryTabFurnitureViewProps> = props =>
{
    const inventoryContext = useContext(InventoryContext);

    return (
        <>Furniture content</>
    );
}
