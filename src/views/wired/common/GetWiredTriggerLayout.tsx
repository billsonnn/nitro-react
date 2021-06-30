import { WiredTriggerAvatarEnterRoomView } from '../views/triggers/avatar-enter-room/WiredTriggerAvatarEnterRoomView';
import { WiredTriggerAvatarSaysSomethingView } from '../views/triggers/avatar-says-something/WiredTriggerAvatarSaysSomethingView';
import { WiredTriggerAvatarWalksOffFurniView } from '../views/triggers/avatar-walks-off-furni/WiredTriggerAvatarWalksOffFurniView';
import { WiredTriggerAvatarWalksOnFurniView } from '../views/triggers/avatar-walks-on-furni/WiredTriggerAvatarWalksOnFurni';
import { WiredTriggerBotReachedAvatarView } from '../views/triggers/bot-reached-avatar/WiredTriggerBotReachedAvatarView';
import { WiredTriggerBotReachedStuffView } from '../views/triggers/bot-reached-stuff/WiredTriggerBotReachedStuffView';
import { WiredTriggerCollisionView } from '../views/triggers/collision/WiredTriggerCollisionView';
import { WiredTriggeExecuteOnceView } from '../views/triggers/execute-once/WiredTriggerExecuteOnceView';
import { WiredTriggeExecutePeriodicallyLongView } from '../views/triggers/execute-periodically-long/WiredTriggerExecutePeriodicallyLongView';
import { WiredTriggeExecutePeriodicallyView } from '../views/triggers/execute-periodically/WiredTriggerExecutePeriodicallyView';
import { WiredTriggerGameEndsView } from '../views/triggers/game-ends/WiredTriggerGameEndsView';
import { WiredTriggerGameStartsView } from '../views/triggers/game-starts/WiredTriggerGameStartsView';
import { WiredTriggeScoreAchievedView } from '../views/triggers/score-achieved/WiredTriggerScoreAchievedView';
import { WiredTriggerToggleFurniView } from '../views/triggers/toggle-furni/WiredTriggerToggleFurniView';
import { WiredTriggerLayout } from './WiredTriggerLayoutCode';

export function GetWiredTriggerLayout(code: number): JSX.Element
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
