import { FC, useContext } from 'react';
import { InventoryContext } from '../InventoryView';
import { InventoryTabs } from '../InventoryView.types';
import { InventoryTabBadgesView } from './badges/InventoryTabBadgesView';
import { InventoryTabBotsView } from './bots/InventoryTabBotsView';
import { InventoryTabFurnitureView } from './furniture/InventoryTabFurnitureView';
import { InventoryTabsContentViewProps } from './InventoryTabsContentView.types';
import { InventoryTabPetsView } from './pets/InventoryTabPetsView';

export const InventoryTabsContentView: FC<InventoryTabsContentViewProps> = props =>
{
    const inventoryContext = useContext(InventoryContext);
    
    return (
        <div className="p-3">
            { inventoryContext && inventoryContext.currentTab && inventoryContext.currentTab === InventoryTabs.FURNITURE } <InventoryTabFurnitureView />
            { inventoryContext && inventoryContext.currentTab && inventoryContext.currentTab === InventoryTabs.BOTS } <InventoryTabBotsView />
            { inventoryContext && inventoryContext.currentTab && inventoryContext.currentTab === InventoryTabs.PETS } <InventoryTabPetsView />
            { inventoryContext && inventoryContext.currentTab && inventoryContext.currentTab === InventoryTabs.BADGES } <InventoryTabBadgesView />
        </div>
    );
}
