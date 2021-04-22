export interface InventoryViewProps
{}

export interface IInventoryContext
{
    currentTab: string;
    onSetCurrentTab: (tab: string) => void;
}
