import { BotData } from '@nitrots/nitro-renderer';
import { Reducer } from 'react';
import { BotItem } from '../common/BotItem';
import { addSingleBotItem, processBotFragment, removeBotItemById } from '../common/BotUtilities';
import { IUnseenItemTracker } from '../common/unseen/IUnseenItemTracker';

export interface IInventoryBotState
{
    needsBotUpdate: boolean;
    botItem: BotItem;
    botItems: BotItem[];
}

export interface IInventoryBotAction
{
    type: string;
    payload: {
        flag?: boolean;
        botItem?: BotItem;
        botId?: number;
        botData?: BotData;
        fragment?: BotData[];
        unseenTracker?: IUnseenItemTracker;
    }
}

export class InventoryBotActions
{
    public static SET_NEEDS_UPDATE: string = 'IBA_SET_NEEDS_UPDATE';
    public static SET_BOT_ITEM: string = 'IBA_SET_BOT_ITEM';
    public static PROCESS_FRAGMENT: string = 'IBA_PROCESS_FRAGMENT';
    public static ADD_BOT: string = 'IBA_ADD_BOT';
    public static REMOVE_BOT: string = 'IBA_REMOVE_BOT';
}

export const initialInventoryBot: IInventoryBotState = {
    needsBotUpdate: true,
    botItem: null,
    botItems: []
}

export const InventoryBotReducer: Reducer<IInventoryBotState, IInventoryBotAction> = (state, action) =>
{
    switch(action.type)
    {
        case InventoryBotActions.SET_NEEDS_UPDATE:
            return { ...state, needsBotUpdate: (action.payload.flag || false) };
        case InventoryBotActions.SET_BOT_ITEM: {
            let botItem = (action.payload.botItem || state.botItem || null);

            let index = 0;

            if(botItem)
            {
                const foundIndex = state.botItems.indexOf(botItem);

                if(foundIndex > -1) index = foundIndex;
            }

            botItem = (state.botItems[index] || null);

            return { ...state, botItem };
        }
        case InventoryBotActions.PROCESS_FRAGMENT: {
            const botItems = [ ...state.botItems ];

            processBotFragment(botItems, action.payload.fragment, (action.payload.unseenTracker || null));

            return { ...state, botItems };
        }
        case InventoryBotActions.ADD_BOT: {
            const botItems = [ ...state.botItems ];

            addSingleBotItem(action.payload.botData, botItems, true);

            return { ...state, botItems };
        }
        case InventoryBotActions.REMOVE_BOT: {
            const botItems = [ ...state.botItems ];

            removeBotItemById(action.payload.botId, botItems);

            return { ...state, botItems };
        }
        default:
            return state;
    }
}
