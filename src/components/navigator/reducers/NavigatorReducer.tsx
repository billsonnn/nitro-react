import { NavigatorCategoryDataParser, NavigatorSearchResultSet, NavigatorTopLevelContext } from '@nitrots/nitro-renderer';
import { Reducer } from 'react';
import { RoomInfoData } from '../common/RoomInfoData';

export interface INavigatorState
{
    needsNavigatorUpdate: boolean;
    topLevelContext: NavigatorTopLevelContext;
    topLevelContexts: NavigatorTopLevelContext[];
    searchResult: NavigatorSearchResultSet;
    categories: NavigatorCategoryDataParser[];
    roomInfoData: RoomInfoData;
    homeRoomId: number;
}

export interface INavigatorAction
{
    type: string;
    payload: {
        flag?: boolean;
        topLevelContext?: NavigatorTopLevelContext;
        topLevelContexts?: NavigatorTopLevelContext[];
        searchResult?: NavigatorSearchResultSet;
        categories?: NavigatorCategoryDataParser[];
        roomInfoData?: RoomInfoData;
        homeRoomId?: number;
    }
}

export class NavigatorActions
{
    public static SET_NEEDS_UPDATE: string = 'NA_SET_NEEDS_UPDATE';
    public static SET_TOP_LEVEL_CONTEXT: string = 'NA_SET_TOP_LEVEL_CONTEXT';
    public static SET_TOP_LEVEL_CONTEXTS: string = 'NA_SET_TOP_LEVEL_CONTEXTS';
    public static SET_SEARCH_RESULT: string = 'NA_SET_SEARCH_RESULT';
    public static SET_CATEGORIES: string = 'NA_SET_CATEGORIES';
    public static SET_ROOM_INFO_DATA: string = 'NA_SET_ROOM_INFO_DATA';
    public static SET_HOME_ROOM_ID: string = 'NA_SET_HOME_ROOM_ID';
}

export const initialNavigator: INavigatorState = {
    needsNavigatorUpdate: true,
    topLevelContext: null,
    topLevelContexts: null,
    searchResult: null,
    categories: null,
    roomInfoData: new RoomInfoData(),
    homeRoomId: null
}

export const NavigatorReducer: Reducer<INavigatorState, INavigatorAction> = (state, action) =>
{
    switch(action.type)
    {
        case NavigatorActions.SET_NEEDS_UPDATE:
            return { ...state, needsNavigatorUpdate: (action.payload.flag || false) };
        case NavigatorActions.SET_TOP_LEVEL_CONTEXT: {
                let topLevelContext = (action.payload.topLevelContext || state.topLevelContext || null);
    
                let index = 0;
    
                if(topLevelContext)
                {
                    const foundIndex = state.topLevelContexts.indexOf(topLevelContext);
    
                    if(foundIndex > -1) index = foundIndex;
                }
    
                topLevelContext = (state.topLevelContexts[index] || null);
    
                return { ...state, topLevelContext };
            }
        case NavigatorActions.SET_TOP_LEVEL_CONTEXTS: {
            const topLevelContexts = (action.payload.topLevelContexts || state.topLevelContexts || null);
            const topLevelContext = topLevelContexts[0];

            return { ...state, topLevelContext, topLevelContexts };
        }
        case NavigatorActions.SET_SEARCH_RESULT: {
            const searchResult = (action.payload.searchResult || state.searchResult || null);
            const searchCode = searchResult.code;

            let topLevelContext = state.topLevelContext;

            if(searchCode !== topLevelContext.code)
            {
                for(const existingContext of state.topLevelContexts)
                {
                    if(existingContext.code !== searchCode) continue;

                    topLevelContext = existingContext;
                }
            }

            return { ...state, topLevelContext, searchResult };
        }
        case NavigatorActions.SET_CATEGORIES: {
            const categories = (action.payload.categories || state.categories || null);

            return { ...state, categories };
        }
        case NavigatorActions.SET_ROOM_INFO_DATA: {
            const roomInfoData = (action.payload.roomInfoData || state.roomInfoData || null);

            return { ...state, roomInfoData };
        }
        case NavigatorActions.SET_HOME_ROOM_ID: {
            const homeRoomId = (action.payload.homeRoomId || state.homeRoomId || null);

            return { ...state, homeRoomId };
        }
        default:
            return state;
    }
}
