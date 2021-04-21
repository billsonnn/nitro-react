import { NavigatorSearchResultList, NavigatorTopLevelContext } from 'nitro-renderer';

export interface NavigatorMessageHandlerProps
{
    setTopLevelContext: (context: NavigatorTopLevelContext) => void;
    setTopLevelContexts: (contexts: NavigatorTopLevelContext[]) => void;
    setSearchResults: (results: NavigatorSearchResultList[]) => void;
}
