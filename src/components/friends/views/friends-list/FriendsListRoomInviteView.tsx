import { FC, useState } from 'react';
import { LocalizeText } from '../../../../api';
import { Button, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../common';

interface FriendsRoomInviteViewProps
{
    selectedFriendsIds: number[];
    onCloseClick: () => void;
    sendRoomInvite: (message: string) => void;
}

export const FriendsRoomInviteView: FC<FriendsRoomInviteViewProps> = props =>
{
    const { selectedFriendsIds = null, onCloseClick = null, sendRoomInvite = null } = props;
    const [ roomInviteMessage, setRoomInviteMessage ] = useState<string>('');

    return (
        <NitroCardView className="nitro-friends-room-invite" theme="primary-slim" uniqueKey="nitro-friends-room-invite">
            <NitroCardHeaderView headerText={ LocalizeText('friendlist.invite.title') } onCloseClick={ onCloseClick } />
            <NitroCardContentView className="text-black">
                { LocalizeText('friendlist.invite.summary', [ 'count' ], [ selectedFriendsIds.length.toString() ]) }
                <textarea className="min-h-[calc(1.5em+ .5rem+2px)] px-[.5rem] py-[.25rem]  rounded-[.2rem]" maxLength={ 255 } value={ roomInviteMessage } onChange={ event => setRoomInviteMessage(event.target.value) }></textarea>
                <Text center className="bg-muted rounded p-1">{ LocalizeText('friendlist.invite.note') }</Text>
                <div className="flex gap-1">
                    <Button fullWidth disabled={ ((roomInviteMessage.length === 0) || (selectedFriendsIds.length === 0)) } variant="success" onClick={ () => sendRoomInvite(roomInviteMessage) }>{ LocalizeText('friendlist.invite.send') }</Button>
                    <Button fullWidth onClick={ onCloseClick }>{ LocalizeText('generic.cancel') }</Button>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    );
};
