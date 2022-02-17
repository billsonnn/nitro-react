import { ModMessageMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { NotificationAlertEvent } from '../../../../../events';
import { dispatchUiEvent, SendMessageHook } from '../../../../../hooks';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../../layout';
import { ModToolsSendUserMessageViewProps } from './ModToolsSendUserMessage.types';

export const ModToolsSendUserMessageView: FC<ModToolsSendUserMessageViewProps> = props =>
{
    const { user = null, onCloseClick = null } = props;
    const [message, setMessage] = useState('');


    const sendMessage = useCallback(() =>
    {
        if(message.trim().length === 0)
        {
            dispatchUiEvent(new NotificationAlertEvent(['Please write a message to user.'], null, null, null, 'Error', null));
            return;
        }

        SendMessageHook(new ModMessageMessageComposer(user.userId, message, -999));

        onCloseClick();
    }, [message, onCloseClick, user.userId]);

    return (
        <NitroCardView className="nitro-mod-tools-user-message" simple={true}>
            <NitroCardHeaderView headerText={'Send Message'} onCloseClick={ () => onCloseClick() } />
            <NitroCardContentView className="text-black">
                {user && <>
                    <div>Message To: {user.username}</div>
                    <div className="form-group mb-2">
                        <textarea className="form-control" value={message} onChange={e => setMessage(e.target.value)}></textarea>
                    </div>

                    <div className="form-group mb-2">
                        <button type="button" className="btn btn-primary" onClick={ () => sendMessage()}>Send message</button>
                    </div>
                </>}
            </NitroCardContentView>
        </NitroCardView>
    );
}
