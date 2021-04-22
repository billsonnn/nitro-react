export interface InventoryViewProps
{}

export interface IInventoryContext
{
    currentTab: string;
    onSetCurrentTab: (tab: string) => void;
}

export class InventoryTabs
{
    public static readonly FURNITURE: string    = 'inventory.furni';
    public static readonly BOTS: string         = 'inventory.bots';
    public static readonly PETS: string         = 'inventory.furni.tab.pets';
    public static readonly BADGES: string       = 'inventory.badges';
}
