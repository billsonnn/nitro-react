import { NavigatorSearchResultList, NavigatorTopLevelContext } from 'nitro-renderer';
import { NavigatorLockViewStage } from './lock/NavigatorLockView.types';

export interface NavigatorMessageHandlerProps
{
    setTopLevelContext: (context: NavigatorTopLevelContext) => void;
    setTopLevelContexts: (contexts: NavigatorTopLevelContext[]) => void;
    setSearchResults: (results: NavigatorSearchResultList[]) => void;
    showLock: (stage?: NavigatorLockViewStage) => void;
    hideLock: () => void;
}
