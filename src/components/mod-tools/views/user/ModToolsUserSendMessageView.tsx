import { ModMessageMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useState } from 'react';
import { ISelectedUser, SendMessageComposer } from '../../../../api';
import { Button, DraggableWindowPosition, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../common';
import { useNotification } from '../../../../hooks';

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

    if(!user) return null;

    const sendMessage = () =>
    {
        if(message.trim().length === 0)
        {
            simpleAlert('Please write a message to user.', null, null, null, 'Error', null);

            return;
        }

        SendMessageComposer(new ModMessageMessageComposer(user.userId, message, -999));

        onCloseClick();
    };

    return (
        <NitroCardView className="nitro-mod-tools-user-message" theme="primary-slim" windowPosition={ DraggableWindowPosition.TOP_LEFT }>
            <NitroCardHeaderView headerText={ 'Send Message' } onCloseClick={ () => onCloseClick() } />
            <NitroCardContentView className="text-black">
                <Text>Message To: { user.username }</Text>
                <textarea className="min-h-[calc(1.5em+ .5rem+2px)] px-[.5rem] py-[.25rem]  rounded-[.2rem]" value={ message } onChange={ event => setMessage(event.target.value) }></textarea>
                <Button fullWidth onClick={ sendMessage }>Send message</Button>
            </NitroCardContentView>
        </NitroCardView>
    );
};
