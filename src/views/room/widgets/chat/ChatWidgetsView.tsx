import { ChatWidgetsViewProps } from './ChatWidgetsView.types';
import { ChatFormWidgetView } from './form/ChatFormWidgetView';
import { ChatMessagesWidgetView } from './messages/ChatMessagesWidgetView';

export function ChatWidgetsView(props: ChatWidgetsViewProps): JSX.Element
{
    const {} = props;

    return (
        <>
            <ChatMessagesWidgetView />
            <ChatFormWidgetView />
        </>
    );
}
