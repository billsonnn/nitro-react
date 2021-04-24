import { ProviderProps } from 'react';

export interface IInventoryContext
{
    currentTab: string;
    setCurrentTab: (tab: string) => void;
}

export interface InventoryContextProps extends ProviderProps<IInventoryContext>
{

}
