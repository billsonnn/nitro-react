import { NavigatorTopLevelContext } from 'nitro-renderer';

export interface NavigatorTabViewProps
{
    context: NavigatorTopLevelContext;
    isActive?: boolean;
    setTopLevelContext: (context: NavigatorTopLevelContext) => void;
}
