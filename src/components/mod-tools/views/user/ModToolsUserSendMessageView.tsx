import { ModMessageMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { SendMessageComposer } from '../../../../api';
import { Button, DraggableWindowPosition, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../common';
import { useNotification } from '../../../../hooks';
import { ISelectedUser } from '../../common/ISelectedUser';

interface ModToolsUserSendMessageViewProps
{
    user: ISelectedUser;
    onCloseClick: () => void;
}

export const ModToolsUserSendMessageView: FC<ModToolsUserSendMessageViewProps> = props =>
{
    const { user = null, onCloseClick = null } = props;
    const [ message, setMessage ] = useState('');
    const { simpleAlert = null } = useNotification();

    const sendMessage = useCallback(() =>
    {
        if(message.trim().length === 0)
        {
            simpleAlert('Please write a message to user.', null, null, null, 'Error', null);
            
            return;
        }

        SendMessageComposer(new ModMessageMessageComposer(user.userId, message, -999));

        onCloseClick();
    }, [ message, user, onCloseClick, simpleAlert ]);

    if(!user) return null;

    return (
        <NitroCardView className="nitro-mod-tools-user-message" theme="primary-slim" windowPosition={ DraggableWindowPosition.TOP_LEFT }>
            <NitroCardHeaderView headerText={ 'Send Message' } onCloseClick={ () => onCloseClick() } />
            <NitroCardContentView className="text-black">
                <Text>Message To: { user.username }</Text>
                <textarea className="form-control" value={ message } onChange={ event => setMessage(event.target.value) }></textarea>
                <Button fullWidth onClick={ sendMessage }>Send message</Button>
            </NitroCardContentView>
        </NitroCardView>
    );
}
