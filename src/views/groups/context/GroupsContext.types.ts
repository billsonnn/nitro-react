import { Dispatch, ProviderProps, Reducer } from 'react';

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
    badgeBases: Map<number, string[]>;
    badgeSymbols: Map<number, string[]>;
    badgePartColors: Map<number, string>;
    groupColorsA: Map<number, string>;
    groupColorsB: Map<number, string>;
    groupName: string;
    groupDescription: string;
    groupHomeroomId: number;
}

export interface IGroupsAction
{
    type: string;
    payload?: {
        arrayMaps?: Map<number, string[]>[];
        stringMaps?: Map<number, string>[];
        stringValue?: string;
        numberValue?: number;
    }
}

export class GroupsActions
{
    public static SET_BADGE_PARTS: string = 'GA_SET_BADGE_PARTS';
    public static SET_GROUP_NAME: string = 'GA_SET_GROUP_NAME';
    public static SET_GROUP_DESCRIPTION: string = 'GA_SET_GROUP_DESCRIPTION';
    public static SET_GROUP_HOMEROOM_ID: string = 'GA_SET_GROUP_HOMEROOM_ID';
    public static RESET_GROUP_SETTINGS: string = 'GA_RESET_GROUP_SETTINGS';
}

export const initialGroups: IGroupsState = {
    badgeBases: null,
    badgeSymbols: null,
    badgePartColors: null,
    groupColorsA: null,
    groupColorsB: null,
    groupName: '',
    groupDescription: '',
    groupHomeroomId: 0
};

export const GroupsReducer: Reducer<IGroupsState, IGroupsAction> = (state, action) =>
{
    switch(action.type)
    {
        case GroupsActions.SET_BADGE_PARTS: {
            const badgeBases = (action.payload.arrayMaps[0] || state.badgeBases || null);
            const badgeSymbols = (action.payload.arrayMaps[1] || state.badgeSymbols || null);
            const badgePartColors = (action.payload.stringMaps[0] || state.badgePartColors || null);
            const groupColorsA = (action.payload.stringMaps[1] || state.groupColorsA || null);
            const groupColorsB = (action.payload.stringMaps[2] || state.groupColorsB || null);

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
        case GroupsActions.RESET_GROUP_SETTINGS: {
            const groupName = '';
            const groupDescription = '';
            const groupHomeroomId = 0;

            return { ...state, groupName, groupDescription, groupHomeroomId };
        }
        default:
            return state;
    }
}
