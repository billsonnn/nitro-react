import { Dispatch, ProviderProps, Reducer } from 'react';
import { GroupBadgePart } from './../common/GroupBadgePart';

export interface IGroupsContext
{
    groupsState: IGroupsState;
    dispatchGroupsState: Dispatch<IGroupsAction>;
}

export interface GroupsContextProps extends ProviderProps<IGroupsContext>
{

}

export interface IGroupsState
{
    availableRooms: { id: number, name: string }[];
    purchaseCost: number;
    badgeBases: { id: number, images: string[] }[];
    badgeSymbols: { id: number, images: string[] }[];
    badgePartColors: { id: number, color: string }[];
    groupColorsA: { id: number, color: string }[];
    groupColorsB: { id: number, color: string }[];
    groupName: string;
    groupDescription: string;
    groupHomeroomId: number;
    groupBadgeParts: GroupBadgePart[];
    groupColors: number[];
}

export interface IGroupsAction
{
    type: string;
    payload?: {
        objectArrays?: any[];
        stringValue?: string;
        numberValue?: number;
        badgeParts?: GroupBadgePart[];
    }
}

export class GroupsActions
{
    public static SET_PURHCASE_SETTINGS: string = 'GA_SET_PURHCASE_SETTINGS';
    public static SET_GROUP_BADGE_PARTS_CONFIG: string = 'GA_SET_GROUP_BADGE_PARTS_CONFIG';
    public static SET_GROUP_NAME: string = 'GA_SET_GROUP_NAME';
    public static SET_GROUP_DESCRIPTION: string = 'GA_SET_GROUP_DESCRIPTION';
    public static SET_GROUP_HOMEROOM_ID: string = 'GA_SET_GROUP_HOMEROOM_ID';
    public static SET_GROUP_BADGE_PARTS: string = 'GA_SET_BADGE_PARTS';
    public static SET_GROUP_COLORS: string = 'GA_SET_GROUP_COLORS';
    public static RESET_GROUP_SETTINGS: string = 'GA_RESET_GROUP_SETTINGS';
}

export const initialGroups: IGroupsState = {
    availableRooms: null,
    purchaseCost: null,
    badgeBases: null,
    badgeSymbols: null,
    badgePartColors: null,
    groupColorsA: null,
    groupColorsB: null,
    groupName: '',
    groupDescription: '',
    groupHomeroomId: 0,
    groupBadgeParts: null,
    groupColors: null
};

export const GroupsReducer: Reducer<IGroupsState, IGroupsAction> = (state, action) =>
{
    switch(action.type)
    {
        case GroupsActions.SET_PURHCASE_SETTINGS: {
            const availableRooms = action.payload.objectArrays;
            const purchaseCost = (action.payload.numberValue || state.purchaseCost || 0);

            return { ...state, availableRooms, purchaseCost };
        }
        case GroupsActions.SET_GROUP_BADGE_PARTS_CONFIG: {
            const badgeBases = (action.payload.objectArrays[0] || state.badgeBases || null);
            const badgeSymbols = (action.payload.objectArrays[1] || state.badgeSymbols || null);
            const badgePartColors = (action.payload.objectArrays[2] || state.badgePartColors || null);
            const groupColorsA = (action.payload.objectArrays[3] || state.groupColorsA || null);
            const groupColorsB = (action.payload.objectArrays[4] || state.groupColorsB || null);

            return { ...state, badgeBases, badgeSymbols, badgePartColors, groupColorsA, groupColorsB };
        }
        case GroupsActions.SET_GROUP_NAME: {
            const groupName = action.payload.stringValue;

            return { ...state, groupName };
        }
        case GroupsActions.SET_GROUP_DESCRIPTION: {
            const groupDescription = action.payload.stringValue;

            return { ...state, groupDescription };
        }
        case GroupsActions.SET_GROUP_HOMEROOM_ID: {
            const groupHomeroomId = action.payload.numberValue;

            return { ...state, groupHomeroomId };
        }
        case GroupsActions.SET_GROUP_BADGE_PARTS: {
            const groupBadgeParts = action.payload.badgeParts;

            return { ...state, groupBadgeParts };
        }
        case GroupsActions.SET_GROUP_COLORS: {
            const groupColors = action.payload.objectArrays;

            return { ...state, groupColors };
        }
        case GroupsActions.RESET_GROUP_SETTINGS: {
            const groupName = '';
            const groupDescription = '';
            const groupHomeroomId = 0;
            const groupBadgeParts = null;
            const groupColors = null;
            
            return { ...state, groupName, groupDescription, groupHomeroomId, groupBadgeParts, groupColors };
        }
        default:
            return state;
    }
}
