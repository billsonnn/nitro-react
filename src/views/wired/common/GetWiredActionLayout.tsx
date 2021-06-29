import { WiredActionBotChangeFigureView } from '../views/actions/bot-change-figure/WiredActionBotChangeFigureView';
import { WiredActionBotFollowAvatarView } from '../views/actions/bot-follow-avatar/WiredActionBotFollowAvatarView';
import { WiredActionBotGiveHandItemView } from '../views/actions/bot-give-hand-item/WiredActionBotGiveHandItemView';
import { WiredActionBotMoveView } from '../views/actions/bot-move/WiredActionBotMoveView';
import { WiredActionBotTalkToAvatarView } from '../views/actions/bot-talk-to-avatar/WiredActionBotTalkToAvatarView';
import { WiredActionBotTalkView } from '../views/actions/bot-talk/WiredActionBotTalkView';
import { WiredActionBotTeleportView } from '../views/actions/bot-teleport/WiredActionBotTeleportView';
import { WiredActionCallAnotherStackView } from '../views/actions/call-another-stack/WiredActionCallAnotherStackView';
import { WiredActionChaseView } from '../views/actions/chase/WiredActionChaseView';
import { WiredActionChatView } from '../views/actions/chat/WiredActionChatView';
import { WiredActionFleeView } from '../views/actions/flee/WiredActionFleeView';
import { WiredActionGiveRewardView } from '../views/actions/give-reward/WiredActionGiveRewardView';
import { WiredActionGiveScoreToPredefinedTeamView } from '../views/actions/give-score-to-predefined-team/WiredActionGiveScoreToPredefinedTeamView';
import { WiredActionGiveScoreView } from '../views/actions/give-score/WiredActionGiveScoreView';
import { WiredActionJoinTeamView } from '../views/actions/join-team/WiredActionJoinTeamView';
import { WiredActionKickFromRoomView } from '../views/actions/kick-from-room/WiredActionKickFromRoomView';
import { WiredActionLeaveTeamView } from '../views/actions/leave-team/WiredActionLeaveTeamView';
import { WiredActionMoveAndRotateFurniView } from '../views/actions/move-and-rotate-furni/WiredActionMoveAndRotateFurniView';
import { WiredActionMoveFurniToView } from '../views/actions/move-furni-to/WiredActionMoveFurniToView';
import { WiredActionMoveFurniView } from '../views/actions/move-furni/WiredActionMoveFurniView';
import { WiredActionMuteUserView } from '../views/actions/mute-user/WiredActionMuteUserView';
import { WiredActionResetView } from '../views/actions/reset/WiredActionResetView';
import { WiredActionSetFurniStateToView } from '../views/actions/set-furni-state-to/WiredActionSetFurniStateToView';
import { WiredActionTeleportView } from '../views/actions/teleport/WiredActionTeleportView';
import { WiredActionToggleFurniStateView } from '../views/actions/toggle-furni-state/WiredActionToggleFurniStateView';
import { WiredActionLayout } from './WiredActionLayoutCode';

export function GetWiredActionLayout(code: number): JSX.Element
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
}
