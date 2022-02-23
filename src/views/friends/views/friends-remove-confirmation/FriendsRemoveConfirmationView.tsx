import { FC } from 'react';
import { LocalizeText } from '../../../../api';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../layout';
import { FriendsRemoveConfirmationViewProps } from './FriendsRemoveConfirmationView.types';

export const FriendsRemoveConfirmationView: FC<FriendsRemoveConfirmationViewProps> = props =>
{
    const { selectedFriendsIds = null, removeFriendsText = null, removeSelectedFriends = null, onCloseClick = null } = props;

    return (
        <NitroCardView className="nitro-friends-remove-confirmation" uniqueKey="nitro-friends-remove-confirmation" simple={ true }>
            <NitroCardHeaderView headerText={ LocalizeText('friendlist.removefriendconfirm.title') } onCloseClick={ onCloseClick } />
            <NitroCardContentView className="text-black d-flex flex-column gap-3">
               <div>{ removeFriendsText }</div>
               <div className="d-flex gap-2">
                    <button className="btn btn-danger w-100" disabled={ selectedFriendsIds.length === 0 } onClick={ removeSelectedFriends }>{ LocalizeText('generic.ok') }</button>
                    <button className="btn btn-primary w-100" onClick={ onCloseClick }>{ LocalizeText('generic.cancel') }</button>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    );
};
