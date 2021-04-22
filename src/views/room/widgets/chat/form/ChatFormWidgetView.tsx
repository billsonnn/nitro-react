import { LocalizeText } from '../../../../../utils/LocalizeText';
import { ChatFormWidgetViewProps } from './ChatFormWidgetView.types';

export function ChatFormWidgetView(props: ChatFormWidgetViewProps): JSX.Element
{
    const {} = props;

    return (
        <div className="nitro-chat-form fixed-bottom mb-4 d-flex justify-content-center">
            <div className="nitro-chat-form-input">
                <input type="text" className="form-control" placeholder={ LocalizeText('widgets.chatinput.default') } />
            </div>
        </div>
    );
}
