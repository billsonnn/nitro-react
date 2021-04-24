import { FC } from 'react';
import { LocalizeText } from '../../../../utils/LocalizeText';
import { ChatInputViewProps } from './ChatInputView.types';

export const ChatInputView: FC<ChatInputViewProps> = props =>
{
    return (
        <div className="nitro-chat-input fixed-bottom mb-4 d-flex justify-content-center">
            <div className="nitro-chat-form-input">
                <input type="text" className="form-control" placeholder={ LocalizeText('widgets.chatinput.default') } />
            </div>
        </div>
    );
}
