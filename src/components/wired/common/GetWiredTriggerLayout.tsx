import { WiredTriggerAvatarEnterRoomView } from '../views/triggers/WiredTriggerAvatarEnterRoomView';
import { WiredTriggerAvatarSaysSomethingView } from '../views/triggers/WiredTriggerAvatarSaysSomethingView';
import { WiredTriggerAvatarWalksOffFurniView } from '../views/triggers/WiredTriggerAvatarWalksOffFurniView';
import { WiredTriggerAvatarWalksOnFurniView } from '../views/triggers/WiredTriggerAvatarWalksOnFurni';
import { WiredTriggerBotReachedAvatarView } from '../views/triggers/WiredTriggerBotReachedAvatarView';
import { WiredTriggerBotReachedStuffView } from '../views/triggers/WiredTriggerBotReachedStuffView';
import { WiredTriggerCollisionView } from '../views/triggers/WiredTriggerCollisionView';
import { WiredTriggeExecuteOnceView } from '../views/triggers/WiredTriggerExecuteOnceView';
import { WiredTriggeExecutePeriodicallyLongView } from '../views/triggers/WiredTriggerExecutePeriodicallyLongView';
import { WiredTriggeExecutePeriodicallyView } from '../views/triggers/WiredTriggerExecutePeriodicallyView';
import { WiredTriggerGameEndsView } from '../views/triggers/WiredTriggerGameEndsView';
import { WiredTriggerGameStartsView } from '../views/triggers/WiredTriggerGameStartsView';
import { WiredTriggeScoreAchievedView } from '../views/triggers/WiredTriggerScoreAchievedView';
import { WiredTriggerToggleFurniView } from '../views/triggers/WiredTriggerToggleFurniView';
import { WiredTriggerLayout } from './WiredTriggerLayoutCode';

export const GetWiredTriggerLayout = (code: number) =>
{
    switch(code)
    {
        case WiredTriggerLayout.AVATAR_ENTERS_ROOM:
            return <WiredTriggerAvatarEnterRoomView />;
        case WiredTriggerLayout.AVATAR_SAYS_SOMETHING:
            return <WiredTriggerAvatarSaysSomethingView />;
        case WiredTriggerLayout.AVATAR_WALKS_OFF_FURNI:
            return <WiredTriggerAvatarWalksOffFurniView />;
        case WiredTriggerLayout.AVATAR_WALKS_ON_FURNI:
            return <WiredTriggerAvatarWalksOnFurniView />;
        case WiredTriggerLayout.BOT_REACHED_AVATAR:
            return <WiredTriggerBotReachedAvatarView />;
        case WiredTriggerLayout.BOT_REACHED_STUFF:
            return <WiredTriggerBotReachedStuffView />;
        case WiredTriggerLayout.COLLISION:
            return <WiredTriggerCollisionView />;
        case WiredTriggerLayout.EXECUTE_ONCE:
            return <WiredTriggeExecuteOnceView />;
        case WiredTriggerLayout.EXECUTE_PERIODICALLY:
            return <WiredTriggeExecutePeriodicallyView />;
        case WiredTriggerLayout.EXECUTE_PERIODICALLY_LONG:
            return <WiredTriggeExecutePeriodicallyLongView />;
        case WiredTriggerLayout.GAME_ENDS:
            return <WiredTriggerGameEndsView />;
        case WiredTriggerLayout.GAME_STARTS:
            return <WiredTriggerGameStartsView />;
        case WiredTriggerLayout.SCORE_ACHIEVED:
            return <WiredTriggeScoreAchievedView />;
        case WiredTriggerLayout.TOGGLE_FURNI:
            return <WiredTriggerToggleFurniView />;
    }

    return null;
}
