import { FC } from 'react';
import { useInventoryContext } from '../../context/InventoryContext';
import { InventoryTabBadgesViewProps } from './InventoryTabBadgesView.types';

export const InventoryTabBadgesView: FC<InventoryTabBadgesViewProps> = props =>
{
    const inventoryContext = useInventoryContext();

    return (
        <>Badges content</>
    );
}
