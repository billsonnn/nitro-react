import { ModMessageMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { Button, Text } from '../../../../common';
import { NotificationAlertEvent } from '../../../../events';
import { dispatchUiEvent, SendMessageHook } from '../../../../hooks';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../layout';
import { ISelectedUser } from '../../utils/ISelectedUser';

interface ModToolsUserSendMessageViewProps
{
    user: ISelectedUser;
    onCloseClick: () => void;
}

export const ModToolsUserSendMessageView: FC<ModToolsUserSendMessageViewProps> = props =>
{
    const { user = null, onCloseClick = null } = props;
    const [ message, setMessage ] = useState('');

    const sendMessage = useCallback(() =>
    {
        if(message.trim().length === 0)
        {
            dispatchUiEvent(new NotificationAlertEvent([ 'Please write a message to user.' ], null, null, null, 'Error', null));
            
            return;
        }

        SendMessageHook(new ModMessageMessageComposer(user.userId, message, -999));

        onCloseClick();
    }, [ message, user, onCloseClick ]);

    if(!user) return null;

    return (
        <NitroCardView className="nitro-mod-tools-user-message" simple>
            <NitroCardHeaderView headerText={'Send Message'} onCloseClick={ () => onCloseClick() } />
            <NitroCardContentView className="text-black">
                <Text>Message To: { user.username }</Text>
                <textarea className="form-control" value={ message } onChange={ event => setMessage(event.target.value) }></textarea>
                <Button fullWidth onClick={ sendMessage }>Send message</Button>
            </NitroCardContentView>
        </NitroCardView>
    );
}
