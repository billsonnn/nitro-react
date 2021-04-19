import { NavigatorTopLevelContext } from 'nitro-renderer';

export interface NavigatorTabsViewProps
{
    topLevelContext: NavigatorTopLevelContext;
    topLevelContexts: NavigatorTopLevelContext[];
    setTopLevelContext: (context: NavigatorTopLevelContext) => void;
}
