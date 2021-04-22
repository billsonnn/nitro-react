import { ChatWidgetsViewProps } from './ChatWidgetsView.types';
import { ChatMessagesWidgetView } from './messages/ChatMessagesWidgetView';

export function ChatWidgetsView(props: ChatWidgetsViewProps): JSX.Element
{
    const {} = props;

    return (
        <div className="nitro-chat-widget">
            <ChatMessagesWidgetView />
        </div>
    );
}
