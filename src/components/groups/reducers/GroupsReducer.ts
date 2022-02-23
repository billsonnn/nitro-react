import { Reducer } from 'react';
import { GroupBadgePart } from '../common/GroupBadgePart';

export interface IGroupsState
{
    availableRooms: { id: number, name: string }[];
    purchaseCost: number;
    badgeBases: { id: number, images: string[] }[];
    badgeSymbols: { id: number, images: string[] }[];
    badgePartColors: { id: number, color: string }[];
    groupId: number;
    groupColorsA: { id: number, color: string }[];
    groupColorsB: { id: number, color: string }[];
    groupName: string;
    groupDescription: string;
    groupHomeroomId: number;
    groupBadgeParts: GroupBadgePart[];
    groupColors: number[];
    groupState: number;
    groupCanMembersDecorate: boolean;
}

export interface IGroupsAction
{
    type: string;
    payload?: {
        objectValues?: any[];
        stringValues?: string[];
        numberValues?: number[];
        boolValues?: boolean[];
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
    public static SET_GROUP_STATE: string = 'GA_SET_GROUP_STATE';
    public static SET_GROUP_CAN_MEMBERS_DECORATE: string = 'GA_SET_GROUP_CAN_MEMBERS_DECORATE';
    public static SET_GROUP_SETTINGS: string = 'GA_SET_GROUP_SETTINGS';
    public static RESET_GROUP_SETTINGS: string = 'GA_RESET_GROUP_SETTINGS';
}

export const initialGroups: IGroupsState = {
    availableRooms: null,
    purchaseCost: null,
    badgeBases: null,
    badgeSymbols: null,
    badgePartColors: null,
    groupId: null,
    groupColorsA: null,
    groupColorsB: null,
    groupName: '',
    groupDescription: '',
    groupHomeroomId: 0,
    groupBadgeParts: null,
    groupColors: null,
    groupState: null,
    groupCanMembersDecorate: null
};

export const GroupsReducer: Reducer<IGroupsState, IGroupsAction> = (state, action) =>
{
    switch(action.type)
    {
        case GroupsActions.SET_PURHCASE_SETTINGS: {
            const availableRooms = action.payload.objectValues;
            const purchaseCost = (action.payload.numberValues[0] || state.purchaseCost || 0);

            return { ...state, availableRooms, purchaseCost };
        }
        case GroupsActions.SET_GROUP_BADGE_PARTS_CONFIG: {
            const badgeBases = (action.payload.objectValues[0] || state.badgeBases || null);
            const badgeSymbols = (action.payload.objectValues[1] || state.badgeSymbols || null);
            const badgePartColors = (action.payload.objectValues[2] || state.badgePartColors || null);
            const groupColorsA = (action.payload.objectValues[3] || state.groupColorsA || null);
            const groupColorsB = (action.payload.objectValues[4] || state.groupColorsB || null);

            return { ...state, badgeBases, badgeSymbols, badgePartColors, groupColorsA, groupColorsB };
        }
        case GroupsActions.SET_GROUP_NAME: {
            const groupName = action.payload.stringValues[0];

            return { ...state, groupName };
        }
        case GroupsActions.SET_GROUP_DESCRIPTION: {
            const groupDescription = action.payload.stringValues[0];

            return { ...state, groupDescription };
        }
        case GroupsActions.SET_GROUP_HOMEROOM_ID: {
            const groupHomeroomId = action.payload.numberValues[0];

            return { ...state, groupHomeroomId };
        }
        case GroupsActions.SET_GROUP_BADGE_PARTS: {
            const groupBadgeParts = action.payload.badgeParts;

            return { ...state, groupBadgeParts };
        }
        case GroupsActions.SET_GROUP_COLORS: {
            const groupColors = action.payload.objectValues;

            return { ...state, groupColors };
        }
        case GroupsActions.SET_GROUP_STATE: {
            const groupState = action.payload.numberValues[0];

            return { ...state, groupState };
        }
        case GroupsActions.SET_GROUP_CAN_MEMBERS_DECORATE: {
            const groupCanMembersDecorate = action.payload.boolValues[0];

            return { ...state, groupCanMembersDecorate };
        }
        case GroupsActions.SET_GROUP_SETTINGS: {
            const groupId = action.payload.numberValues[0];
            const groupName = action.payload.stringValues[0];
            const groupDescription = action.payload.stringValues[1];
            const groupBadgeParts = action.payload.objectValues;
            const groupState = action.payload.numberValues[1];
            const groupColors = action.payload.numberValues.slice(2);
            const groupCanMembersDecorate = action.payload.boolValues[0];
            
            return { ...state, groupId, groupName, groupDescription, groupBadgeParts, groupColors, groupState, groupCanMembersDecorate };
        }
        case GroupsActions.RESET_GROUP_SETTINGS: {
            const groupId = null;
            const groupName = '';
            const groupDescription = '';
            const groupHomeroomId = 0;
            const groupBadgeParts = null;
            const groupColors = null;
            const groupState = null;
            const groupCanMembersDecorate = null;
            
            return { ...state, groupId, groupName, groupDescription, groupHomeroomId, groupBadgeParts, groupColors, groupState, groupCanMembersDecorate };
        }
        default:
            return state;
    }
}
