import { Reducer } from 'react';

export interface IModToolsState
{
    selectedUser: {webID: number, name: string};
    currentRoomId: number;
    openRooms: number[];
    openChatlogs: number[];
}

export interface IModToolsAction
{
    type: string;
    payload: {
        selectedUser?: {webID: number, name: string};
        currentRoomId?: number;
        openRooms?: number[];
        openChatlogs?: number[];
    }
}

export class ModToolsActions
{
    public static SET_SELECTED_USER: string = 'MTA_SET_SELECTED_USER';
    public static SET_CURRENT_ROOM_ID: string = 'MTA_SET_CURRENT_ROOM_ID';
    public static SET_OPEN_ROOMS: string = 'MTA_SET_OPEN_ROOMS';
    public static SET_OPEN_CHATLOGS: string = 'MTA_SET_OPEN_CHATLOGS';
    public static RESET_STATE: string = 'MTA_RESET_STATE';
}

export const initialModTools: IModToolsState = {
    selectedUser: null,
    currentRoomId: null,
    openRooms: null,
    openChatlogs: null
};

export const ModToolsReducer: Reducer<IModToolsState, IModToolsAction> = (state, action) =>
{
    switch(action.type)
    {
        case ModToolsActions.SET_SELECTED_USER: {
            const selectedUser = (action.payload.selectedUser || state.selectedUser || null);

            return { ...state, selectedUser };
        }
        case ModToolsActions.SET_CURRENT_ROOM_ID: {
            const currentRoomId = (action.payload.currentRoomId || state.currentRoomId || null);

            return { ...state, currentRoomId };
        }
        case ModToolsActions.SET_OPEN_ROOMS: {
            const openRooms = (action.payload.openRooms || state.openRooms || null);

            return { ...state, openRooms };
        }
        case ModToolsActions.RESET_STATE: {
            return { ...initialModTools };
        }
        default:
            return state;
    }
}
