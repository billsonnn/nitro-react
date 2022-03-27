import { NavigatorCategoryDataParser, NavigatorSearchResultSet, NavigatorTopLevelContext, RoomDataParser } from '@nitrots/nitro-renderer';
import { createContext, Dispatch, FC, ProviderProps, SetStateAction, useContext } from 'react';
import { INavigatorData } from '../../api';

interface INavigatorContext
{
    categories: NavigatorCategoryDataParser[];
    setCategories: Dispatch<SetStateAction<NavigatorCategoryDataParser[]>>;
    topLevelContext: NavigatorTopLevelContext;
    setTopLevelContext: Dispatch<SetStateAction<NavigatorTopLevelContext>>;
    topLevelContexts: NavigatorTopLevelContext[];
    setTopLevelContexts: Dispatch<SetStateAction<NavigatorTopLevelContext[]>>;
    navigatorData: INavigatorData;
    setNavigatorData: Dispatch<SetStateAction<INavigatorData>>;
    doorData: { roomInfo: RoomDataParser, state: number };
    setDoorData: Dispatch<SetStateAction<{ roomInfo: RoomDataParser, state: number }>>;
    searchResult: NavigatorSearchResultSet;
    setSearchResult: Dispatch<SetStateAction<NavigatorSearchResultSet>>;
}

const NavigatorContext = createContext<INavigatorContext>({
    categories: null,
    setCategories: null,
    topLevelContext: null,
    setTopLevelContext: null,
    topLevelContexts: null,
    setTopLevelContexts: null,
    navigatorData: null,
    setNavigatorData: null,
    doorData: null,
    setDoorData: null,
    searchResult: null,
    setSearchResult: null
});

export const NavigatorContextProvider: FC<ProviderProps<INavigatorContext>> = props =>
{
    return <NavigatorContext.Provider value={ props.value }>{ props.children }</NavigatorContext.Provider>
}

export const useNavigatorContext = () => useContext(NavigatorContext);
