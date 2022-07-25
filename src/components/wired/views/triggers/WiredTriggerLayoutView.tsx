import { WiredTriggerLayout } from '../../../../api';
import { WiredTriggerAvatarEnterRoomView } from './WiredTriggerAvatarEnterRoomView';
import { WiredTriggerAvatarSaysSomethingView } from './WiredTriggerAvatarSaysSomethingView';
import { WiredTriggerAvatarWalksOffFurniView } from './WiredTriggerAvatarWalksOffFurniView';
import { WiredTriggerAvatarWalksOnFurniView } from './WiredTriggerAvatarWalksOnFurni';
import { WiredTriggerBotReachedAvatarView } from './WiredTriggerBotReachedAvatarView';
import { WiredTriggerBotReachedStuffView } from './WiredTriggerBotReachedStuffView';
import { WiredTriggerCollisionView } from './WiredTriggerCollisionView';
import { WiredTriggeExecuteOnceView } from './WiredTriggerExecuteOnceView';
import { WiredTriggeExecutePeriodicallyLongView } from './WiredTriggerExecutePeriodicallyLongView';
import { WiredTriggeExecutePeriodicallyView } from './WiredTriggerExecutePeriodicallyView';
import { WiredTriggerGameEndsView } from './WiredTriggerGameEndsView';
import { WiredTriggerGameStartsView } from './WiredTriggerGameStartsView';
import { WiredTriggeScoreAchievedView } from './WiredTriggerScoreAchievedView';
import { WiredTriggerToggleFurniView } from './WiredTriggerToggleFurniView';

export const WiredTriggerLayoutView = (code: number) =>
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
