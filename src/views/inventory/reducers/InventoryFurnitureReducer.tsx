import { AdvancedMap, FurnitureListItemParser, TradingListItemParser } from '@nitrots/nitro-renderer';
import { Reducer } from 'react';
import { FurnitureItem } from '../common/FurnitureItem';
import { addFurnitureItem, processFurniFragment, removeFurniItemById } from '../common/FurnitureUtilities';
import { GroupItem } from '../common/GroupItem';
import { TradeState } from '../common/TradeState';
import { TradeUserData } from '../common/TradeUserData';
import { parseTradeItems } from '../common/TradingUtilities';
import { IUnseenItemTracker } from '../common/unseen/IUnseenItemTracker';

export interface IInventoryFurnitureState
{
    needsFurniUpdate: boolean;
    groupItem: GroupItem;
    groupItems: GroupItem[];
    tradeData: {
        ownUser: TradeUserData;
        otherUser: TradeUserData;
        state: number;
    }
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
        ownTradeUser?: TradeUserData;
        otherTradeUser?: TradeUserData;
        tradeState?: number;
        userId?: number;
        tradeParser?: TradingListItemParser;
        unseenTracker?: IUnseenItemTracker;
    }
}

export class InventoryFurnitureActions
{
    public static SET_NEEDS_UPDATE: string = 'IFA_SET_NEEDS_UPDATE';
    public static SET_GROUP_ITEM: string = 'IFA_SET_GROUP_ITEM';
    public static PROCESS_FRAGMENT: string = 'IFA_PROCESS_FRAGMENT';
    public static ADD_OR_UPDATE_FURNITURE: string = 'IFA_ADD_OR_UPDATE_FURNITURE';
    public static REMOVE_FURNITURE: string = 'IFA_REMOVE_FURNITURE';
    public static SET_TRADE_DATA: string = 'IFA_SET_TRADE_DATA';
    public static SET_TRADE_STATE: string = 'IFA_SET_TRADE_STATE';
    public static SET_TRADE_ACCEPTANCE: string = 'FA_SET_TRADE_ACCEPTANCE';
    public static CLOSE_TRADE: string = 'IFA_CLOSE_STRING';
    public static UPDATE_TRADE: string = 'IFA_UPDATE_TRADE';
}

export const initialInventoryFurniture: IInventoryFurnitureState = {
    needsFurniUpdate: true,
    groupItem: null,
    groupItems: [],
    tradeData: null
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

            processFurniFragment(groupItems, (action.payload.fragment || null), (action.payload.unseenTracker || null));

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

                    addFurnitureItem(groupItems, furniture, true);
                }
            }

            return { ...state, groupItems };
        }
        case InventoryFurnitureActions.REMOVE_FURNITURE: {
            const groupItems = [ ...state.groupItems ];

            removeFurniItemById(action.payload.itemId, groupItems);

            return { ...state, groupItems };
        }
        case InventoryFurnitureActions.SET_TRADE_DATA: {
            const tradeData = { ...state.tradeData };

            tradeData.ownUser = (action.payload.ownTradeUser || null);
            tradeData.otherUser = (action.payload.otherTradeUser || null);
            tradeData.state = TradeState.TRADING_STATE_RUNNING;

            return { ...state, tradeData };
        }
        case InventoryFurnitureActions.SET_TRADE_STATE: {
            const tradeData = { ...state.tradeData };

            tradeData.state = (action.payload.tradeState || TradeState.TRADING_STATE_RUNNING);

            return { ...state, tradeData };
        }
        case InventoryFurnitureActions.SET_TRADE_ACCEPTANCE: {
            const tradeData = { ...state.tradeData };

            const userId = (action.payload.userId || -1);

            if(tradeData.ownUser.userId === userId)
            {
                const ownUserData = Object.assign({}, tradeData.ownUser);

                ownUserData.accepts = (action.payload.flag || false);

                tradeData.ownUser = ownUserData;
            }

            else if(tradeData.otherUser.userId === userId)
            {
                const otherUserData = Object.assign({}, tradeData.otherUser);

                otherUserData.accepts = (action.payload.flag || false);

                tradeData.otherUser = otherUserData;
            }

            return { ...state, tradeData };
        }
        case InventoryFurnitureActions.CLOSE_TRADE: {
            const tradeData = null;

            return { ...state, tradeData };
        }
        case InventoryFurnitureActions.UPDATE_TRADE: {
            const tradeData = { ...state.tradeData };
            const groupItems = [ ...state.groupItems ]; 

            const parser = (action.payload.tradeParser || null);

            if(parser)
            {
                const firstUserItems: AdvancedMap<string, GroupItem> = new AdvancedMap();
                const secondUserItems: AdvancedMap<string, GroupItem> = new AdvancedMap();

                parseTradeItems(parser.firstUserItemArray, firstUserItems);
                parseTradeItems(parser.secondUserItemArray, secondUserItems);

                const ownUserData = Object.assign({}, tradeData.ownUser);
                const otherUserData = Object.assign({}, tradeData.otherUser);

                if(tradeData.ownUser.userId === parser.firstUserID)
                {
                    ownUserData.creditsCount = parser.firstUserNumCredits;
                    ownUserData.itemCount = parser.firstUserNumItems;
                    ownUserData.items = firstUserItems;
                }

                else if(tradeData.ownUser.userId === parser.secondUserID)
                {
                    ownUserData.creditsCount = parser.secondUserNumCredits;
                    ownUserData.itemCount = parser.secondUserNumItems;
                    ownUserData.items = secondUserItems;
                }

                if(tradeData.otherUser.userId === parser.firstUserID)
                {
                    otherUserData.creditsCount = parser.firstUserNumCredits;
                    otherUserData.itemCount = parser.firstUserNumItems;
                    otherUserData.items = firstUserItems;
                }

                else if(tradeData.otherUser.userId === parser.secondUserID)
                {
                    otherUserData.creditsCount = parser.secondUserNumCredits;
                    otherUserData.itemCount = parser.secondUserNumItems;
                    otherUserData.items = secondUserItems;
                }

                tradeData.ownUser = ownUserData;
                tradeData.otherUser = otherUserData;

                const tradeIds: number[] = [];

                for(const groupItem of ownUserData.items.getValues())
                {
                    let i = 0;

                    while(i < groupItem.getTotalCount())
                    {
                        const item = groupItem.getItemByIndex(i);

                        if(item) tradeIds.push(item.ref);

                        i++;
                    }
                }

                for(const groupItem of groupItems) groupItem.lockItemIds(tradeIds);
            }

            return { ...state, groupItems, tradeData };
        }
        default:
            return state;
    }
}
