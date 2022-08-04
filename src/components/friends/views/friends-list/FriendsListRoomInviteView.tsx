import { FC, useState } from 'react';
import { LocalizeText } from '../../../../api';
import { Button, Flex, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../common';

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
        <NitroCardView className="nitro-friends-room-invite" uniqueKey="nitro-friends-room-invite" theme="primary-slim">
            <NitroCardHeaderView headerText={ LocalizeText('friendlist.invite.title') } onCloseClick={ onCloseClick } />
            <NitroCardContentView className="text-black">
                { LocalizeText('friendlist.invite.summary', [ 'count' ], [ selectedFriendsIds.length.toString() ]) }
                <textarea className="form-control" value={ roomInviteMessage } maxLength={ 255 } onChange={ event => setRoomInviteMessage(event.target.value) }></textarea>
                <Text center className="bg-muted rounded p-1">{ LocalizeText('friendlist.invite.note') }</Text>
                <Flex gap={ 1 }>
                    <Button fullWidth variant="success" disabled={ ((roomInviteMessage.length === 0) || (selectedFriendsIds.length === 0)) } onClick={ () => sendRoomInvite(roomInviteMessage) }>{ LocalizeText('friendlist.invite.send') }</Button>
                    <Button fullWidth onClick={ onCloseClick }>{ LocalizeText('generic.cancel') }</Button>
                </Flex>
            </NitroCardContentView>
        </NitroCardView>
    );
};
