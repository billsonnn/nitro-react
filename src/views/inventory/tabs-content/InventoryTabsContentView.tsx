import { FC } from 'react';
import { useInventoryContext } from '../context/InventoryContext';
import { InventoryTabs } from '../InventoryView.types';
import { InventoryTabBadgesView } from './badges/InventoryTabBadgesView';
import { InventoryTabBotsView } from './bots/InventoryTabBotsView';
import { InventoryTabFurnitureView } from './furniture/InventoryTabFurnitureView';
import { InventoryTabsContentViewProps } from './InventoryTabsContentView.types';
import { InventoryTabPetsView } from './pets/InventoryTabPetsView';

export const InventoryTabsContentView: FC<InventoryTabsContentViewProps> = props =>
{
    const inventoryContext = useInventoryContext();

    function renderCurrentTab(): JSX.Element
    {
        switch(inventoryContext.currentTab)
        {
            case InventoryTabs.FURNITURE:
                return <InventoryTabFurnitureView />
            case InventoryTabs.BOTS:
                return <InventoryTabBotsView />
            case InventoryTabs.PETS:
                return <InventoryTabPetsView />
            case InventoryTabs.BADGES:
                return <InventoryTabBadgesView />
        }

        return null;
    }
    
    return (
        <div className="px-3 pb-3">
            { inventoryContext && inventoryContext.currentTab && renderCurrentTab() }
        </div>
    );
}
