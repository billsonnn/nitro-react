import { FurnitureListItemParser } from 'nitro-renderer';
import { Reducer } from 'react';
import { FurnitureItem } from '../common/FurnitureItem';
import { addFurnitureItem, processFurniFragment, removeFurniItemById } from '../common/FurnitureUtilities';
import { GroupItem } from '../common/GroupItem';

export interface IInventoryFurnitureState
{
    needsFurniUpdate: boolean;
    groupItem: GroupItem;
    groupItems: GroupItem[];
}

export interface IInventoryFurnitureAction
{
    type: string;
    payload: {
        flag?: boolean;
        groupItem?: GroupItem;
        parsers?: FurnitureListItemParser[];
        itemId?: number;
        fragment?: Map<number, FurnitureListItemParser>;
    }
}

export class InventoryFurnitureActions
{
    public static SET_NEEDS_UPDATE: string = 'IFA_SET_NEEDS_UPDATE';
    public static SET_GROUP_ITEM: string = 'IFA_SET_GROUP_ITEM';
    public static PROCESS_FRAGMENT: string = 'IFA_PROCESS_FRAGMENT';
    public static ADD_OR_UPDATE_FURNITURE: string = 'IFA_ADD_OR_UPDATE_FURNITURE';
    public static REMOVE_FURNITURE: string = 'IFA_REMOVE_FURNITURE';
}

export const initialInventoryFurniture: IInventoryFurnitureState = {
    needsFurniUpdate: true,
    groupItem: null,
    groupItems: []
}

export const InventoryFurnitureReducer: Reducer<IInventoryFurnitureState, IInventoryFurnitureAction> = (state, action) =>
{
    switch(action.type)
    {
        case InventoryFurnitureActions.SET_NEEDS_UPDATE:
            return { ...state, needsFurniUpdate: (action.payload.flag || false) };
        case InventoryFurnitureActions.SET_GROUP_ITEM: {
            let groupItem = (action.payload.groupItem || state.groupItem || null);

            let index = 0;

            if(groupItem)
            {
                const foundIndex = state.groupItems.indexOf(groupItem);

                if(foundIndex > -1) index = foundIndex;
            }

            groupItem = (state.groupItems[index] || null);

            return { ...state, groupItem };
        }
        case InventoryFurnitureActions.PROCESS_FRAGMENT: {
            const groupItems = [ ...state.groupItems ];

            processFurniFragment(groupItems, (action.payload.fragment || null));

            return { ...state, groupItems };
        }
        case InventoryFurnitureActions.ADD_OR_UPDATE_FURNITURE: {
            const groupItems = [ ...state.groupItems ];
            
            for(const item of action.payload.parsers)
            {
                let i = 0;
                let groupItem: GroupItem = null;

                while(i < groupItems.length)
                {
                    const group = groupItems[i];

                    let j = 0;

                    while(j < group.items.length)
                    {
                        const furniture = group.items[j];

                        if(furniture.id === item.itemId)
                        {
                            furniture.update(item);

                            const newFurniture = [ ...group.items ];

                            newFurniture[j] = furniture;

                            group.items = newFurniture;

                            groupItem = group;

                            break;
                        }

                        j++
                    }

                    if(groupItem) break;

                    i++;
                }

                if(groupItem)
                {
                    groupItem.hasUnseenItems = true;

                    groupItems[i] = Object.create(groupItem);
                }
                else
                {
                    const furniture = new FurnitureItem(item);

                    addFurnitureItem(groupItems, furniture, false);
                }
            }

            return { ...state, groupItems };
        }
        case InventoryFurnitureActions.REMOVE_FURNITURE: {
            const groupItems = [ ...state.groupItems ];

            removeFurniItemById(action.payload.itemId, groupItems);

            return { ...state, groupItems };
        }
        default:
            return state;
    }
}
