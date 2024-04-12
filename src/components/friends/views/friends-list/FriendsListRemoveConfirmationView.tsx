import { FC } from 'react';
import { LocalizeText } from '../../../../api';
import { Button, NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../common';

interface FriendsRemoveConfirmationViewProps
{
    selectedFriendsIds: number[];
    removeFriendsText: string;
    removeSelectedFriends: () => void;
    onCloseClick: () => void;
}

export const FriendsRemoveConfirmationView: FC<FriendsRemoveConfirmationViewProps> = props =>
{
    const { selectedFriendsIds = null, removeFriendsText = null, removeSelectedFriends = null, onCloseClick = null } = props;

    return (
        <NitroCardView className="nitro-friends-remove-confirmation" theme="primary-slim">
            <NitroCardHeaderView headerText={ LocalizeText('friendlist.removefriendconfirm.title') } onCloseClick={ onCloseClick } />
            <NitroCardContentView className="text-black">
                <div>{ removeFriendsText }</div>
                <div className="flex gap-1">
                    <Button fullWidth disabled={ (selectedFriendsIds.length === 0) } variant="danger" onClick={ removeSelectedFriends }>{ LocalizeText('generic.ok') }</Button>
                    <Button fullWidth onClick={ onCloseClick }>{ LocalizeText('generic.cancel') }</Button>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    );
};
