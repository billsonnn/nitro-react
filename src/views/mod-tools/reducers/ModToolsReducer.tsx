import { ModeratorInitData } from '@nitrots/nitro-renderer';
import { Reducer } from 'react';

export interface IModToolsState
{
    settings: ModeratorInitData;
    currentRoomId: number;
    openRooms: number[];
    openRoomChatlogs: number[];
    openUserInfo: number[];
    openUserChatlogs: number[];
}

export interface IModToolsAction
{
    type: string;
    payload: {
        settings?: ModeratorInitData;
        currentRoomId?: number;
        openRooms?: number[];
        openRoomChatlogs?: number[];
        openUserInfo?: number[];
        openUserChatlogs?: number[];
    }
}

export class ModToolsActions
{
    public static SET_INIT_DATA: string = 'MTA_SET_INIT_DATA';
    public static SET_CURRENT_ROOM_ID: string = 'MTA_SET_CURRENT_ROOM_ID';
    public static SET_OPEN_ROOMS: string = 'MTA_SET_OPEN_ROOMS';
    public static SET_OPEN_USERINFO: string = 'MTA_SET_OPEN_USERINFO';
    public static SET_OPEN_ROOM_CHATLOGS: string = 'MTA_SET_OPEN_CHATLOGS';
    public static SET_OPEN_USER_CHATLOGS: string = 'MTA_SET_OPEN_USER_CHATLOGS';
    public static RESET_STATE: string = 'MTA_RESET_STATE';
}

export const initialModTools: IModToolsState = {
    settings: null,
    currentRoomId: null,
    openRooms: null,
    openRoomChatlogs: null,
    openUserChatlogs: null,
    openUserInfo: null
};

export const ModToolsReducer: Reducer<IModToolsState, IModToolsAction> = (state, action) =>
{
    switch(action.type)
    {
        case ModToolsActions.SET_INIT_DATA: {
            const settings = (action.payload.settings || state.settings || null);

            return { ...state, settings };
        }
        case ModToolsActions.SET_CURRENT_ROOM_ID: {
            const currentRoomId = (action.payload.currentRoomId || state.currentRoomId || null);

            return { ...state, currentRoomId };
        }
        case ModToolsActions.SET_OPEN_ROOMS: {
            const openRooms = (action.payload.openRooms || state.openRooms || null);

            return { ...state, openRooms };
        }
        case ModToolsActions.SET_OPEN_USERINFO: {
            const openUserInfo = (action.payload.openUserInfo || state.openUserInfo || null);

            return { ...state, openUserInfo };
        }
        case ModToolsActions.SET_OPEN_ROOM_CHATLOGS: {
            const openRoomChatlogs = (action.payload.openRoomChatlogs || state.openRoomChatlogs || null);

            return { ...state, openRoomChatlogs };
        }
        case ModToolsActions.SET_OPEN_USER_CHATLOGS: {
            const openUserChatlogs = (action.payload.openUserChatlogs || state.openUserChatlogs || null);

            return { ...state, openUserChatlogs };
        }
        case ModToolsActions.RESET_STATE: {
            return { ...initialModTools };
        }
        default:
            return state;
    }
}
