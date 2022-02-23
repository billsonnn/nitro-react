import { WiredActionBotChangeFigureView } from '../views/actions/WiredActionBotChangeFigureView';
import { WiredActionBotFollowAvatarView } from '../views/actions/WiredActionBotFollowAvatarView';
import { WiredActionBotGiveHandItemView } from '../views/actions/WiredActionBotGiveHandItemView';
import { WiredActionBotMoveView } from '../views/actions/WiredActionBotMoveView';
import { WiredActionBotTalkToAvatarView } from '../views/actions/WiredActionBotTalkToAvatarView';
import { WiredActionBotTalkView } from '../views/actions/WiredActionBotTalkView';
import { WiredActionBotTeleportView } from '../views/actions/WiredActionBotTeleportView';
import { WiredActionCallAnotherStackView } from '../views/actions/WiredActionCallAnotherStackView';
import { WiredActionChaseView } from '../views/actions/WiredActionChaseView';
import { WiredActionChatView } from '../views/actions/WiredActionChatView';
import { WiredActionFleeView } from '../views/actions/WiredActionFleeView';
import { WiredActionGiveRewardView } from '../views/actions/WiredActionGiveRewardView';
import { WiredActionGiveScoreToPredefinedTeamView } from '../views/actions/WiredActionGiveScoreToPredefinedTeamView';
import { WiredActionGiveScoreView } from '../views/actions/WiredActionGiveScoreView';
import { WiredActionJoinTeamView } from '../views/actions/WiredActionJoinTeamView';
import { WiredActionKickFromRoomView } from '../views/actions/WiredActionKickFromRoomView';
import { WiredActionLeaveTeamView } from '../views/actions/WiredActionLeaveTeamView';
import { WiredActionMoveAndRotateFurniView } from '../views/actions/WiredActionMoveAndRotateFurniView';
import { WiredActionMoveFurniToView } from '../views/actions/WiredActionMoveFurniToView';
import { WiredActionMoveFurniView } from '../views/actions/WiredActionMoveFurniView';
import { WiredActionMuteUserView } from '../views/actions/WiredActionMuteUserView';
import { WiredActionResetView } from '../views/actions/WiredActionResetView';
import { WiredActionSetFurniStateToView } from '../views/actions/WiredActionSetFurniStateToView';
import { WiredActionTeleportView } from '../views/actions/WiredActionTeleportView';
import { WiredActionToggleFurniStateView } from '../views/actions/WiredActionToggleFurniStateView';
import { WiredActionLayout } from './WiredActionLayoutCode';

export const GetWiredActionLayout = (code: number) =>
{
    switch(code)
    {
        case WiredActionLayout.BOT_CHANGE_FIGURE:
            return <WiredActionBotChangeFigureView />;
        case WiredActionLayout.BOT_FOLLOW_AVATAR:
            return <WiredActionBotFollowAvatarView />;
        case WiredActionLayout.BOT_GIVE_HAND_ITEM:
            return <WiredActionBotGiveHandItemView />;
        case WiredActionLayout.BOT_MOVE:
            return <WiredActionBotMoveView />;
        case WiredActionLayout.BOT_TALK:
            return <WiredActionBotTalkView />;
        case WiredActionLayout.BOT_TALK_DIRECT_TO_AVTR:
            return <WiredActionBotTalkToAvatarView />;
        case WiredActionLayout.BOT_TELEPORT:
            return <WiredActionBotTeleportView />;
        case WiredActionLayout.CALL_ANOTHER_STACK:
            return <WiredActionCallAnotherStackView />;
        case WiredActionLayout.CHASE:
            return <WiredActionChaseView />;
        case WiredActionLayout.CHAT:
            return <WiredActionChatView />;
        case WiredActionLayout.FLEE:
            return <WiredActionFleeView />;
        case WiredActionLayout.GIVE_REWARD:
            return <WiredActionGiveRewardView />;
        case WiredActionLayout.GIVE_SCORE:
            return <WiredActionGiveScoreView />;
        case WiredActionLayout.GIVE_SCORE_TO_PREDEFINED_TEAM:
            return <WiredActionGiveScoreToPredefinedTeamView />;
        case WiredActionLayout.JOIN_TEAM:
            return <WiredActionJoinTeamView />;
        case WiredActionLayout.KICK_FROM_ROOM:
            return <WiredActionKickFromRoomView />;
        case WiredActionLayout.LEAVE_TEAM:
            return <WiredActionLeaveTeamView />;
        case WiredActionLayout.MOVE_FURNI:
            return <WiredActionMoveFurniView />;
        case WiredActionLayout.MOVE_AND_ROTATE_FURNI:
            return <WiredActionMoveAndRotateFurniView />;
        case WiredActionLayout.MOVE_FURNI_TO:
            return <WiredActionMoveFurniToView />;
        case WiredActionLayout.MUTE_USER:
            return <WiredActionMuteUserView />;
        case WiredActionLayout.RESET:
            return <WiredActionResetView />;
        case WiredActionLayout.SET_FURNI_STATE:
            return <WiredActionSetFurniStateToView />;
        case WiredActionLayout.TELEPORT:
            return <WiredActionTeleportView />;
        case WiredActionLayout.TOGGLE_FURNI_STATE:
            return <WiredActionToggleFurniStateView />;
    }

    return null;
}
