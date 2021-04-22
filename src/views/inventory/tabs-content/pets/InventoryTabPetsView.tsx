import { FC, useContext } from 'react';
import { InventoryContext } from '../../InventoryView';
import { InventoryTabPetsViewProps } from './InventoryTabPetsView.types';

export const InventoryTabPetsView: FC<InventoryTabPetsViewProps> = props =>
{
    const inventoryContext = useContext(InventoryContext);

    return (
        <></>
    );
}
