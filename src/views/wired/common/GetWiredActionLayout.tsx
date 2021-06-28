import { WiredActionBotChangeFigureView } from '../views/actions/bot-change-figure/WiredActionBotChangeFigureView';
import { WiredActionBotFollowAvatarView } from '../views/actions/bot-follow-avatar/WiredActionBotFollowAvatarView';
import { WiredActionLayout } from './WiredActionLayoutCode';

export function GetWiredActionLayout(code: number): JSX.Element
{
    switch(code)
    {
        case WiredActionLayout.BOT_CHANGE_FIGURE:
            return <WiredActionBotChangeFigureView />;
        case WiredActionLayout.BOT_FOLLOW_AVATAR:
            return <WiredActionBotFollowAvatarView />;
    }
}
