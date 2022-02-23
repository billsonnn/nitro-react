import { FC, useState } from 'react';
import { LocalizeText } from '../../../../api';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../layout';
import { FriendsRoomInviteViewProps } from './FriendsRoomInviteView.types';

export const FriendsRoomInviteView: FC<FriendsRoomInviteViewProps> = props =>
{
    const { selectedFriendsIds = null, onCloseClick = null, sendRoomInvite = null } = props;
    
    const [ roomInviteMessage, setRoomInviteMessage ] = useState<string>('');

    return (
        <NitroCardView className="nitro-friends-room-invite" uniqueKey="nitro-friends-room-invite" simple={ true }>
            <NitroCardHeaderView headerText={ LocalizeText('friendlist.invite.title') } onCloseClick={ onCloseClick } />
            <NitroCardContentView className="text-black d-flex flex-column gap-2">
                { LocalizeText('friendlist.invite.summary', ['count'], [selectedFriendsIds.length.toString()]) }
                <textarea className="form-control" value={roomInviteMessage} onChange={e => setRoomInviteMessage(e.target.value)}></textarea>
                <div className="bg-muted rounded text-center p-2">{ LocalizeText('friendlist.invite.note') }</div>
                <div className="d-flex gap-2">
                    <button className="btn btn-success w-100" disabled={ roomInviteMessage.length === 0 || selectedFriendsIds.length === 0 } onClick={ () => sendRoomInvite(roomInviteMessage) }>{ LocalizeText('friendlist.invite.send') }</button>
                    <button className="btn btn-primary w-100" onClick={ onCloseClick }>{ LocalizeText('generic.cancel') }</button>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    );
};
