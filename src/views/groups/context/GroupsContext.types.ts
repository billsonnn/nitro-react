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
}

export interface IGroupsAction
{
    type: string;
    payload: {
        arrayMaps?: Map<number, string[]>[];
        stringMaps?: Map<number, string>[];
    }
}

export class GroupsActions
{
    public static SET_BADGE_PARTS: string = 'GA_SET_BADGE_PARTS';
}

export const initialGroups: IGroupsState = {
    badgeBases: null,
    badgeSymbols: null,
    badgePartColors: null,
    groupColorsA: null,
    groupColorsB: null
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
        default:
            return state;
    }
}
