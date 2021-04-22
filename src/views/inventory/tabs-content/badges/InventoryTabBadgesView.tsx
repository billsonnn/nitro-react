import { FC, useContext } from 'react';
import { InventoryContext } from '../../InventoryView';
import { InventoryTabBadgesViewProps } from './InventoryTabBadgesView.types';

export const InventoryTabBadgesView: FC<InventoryTabBadgesViewProps> = props =>
{
    const inventoryContext = useContext(InventoryContext);

    return (
        <></>
    );
}
