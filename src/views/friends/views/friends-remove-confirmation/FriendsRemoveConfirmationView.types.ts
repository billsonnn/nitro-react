export interface FriendsRemoveConfirmationViewProps
{
    selectedFriendsIds: number[];
    removeFriendsText: string;
    removeSelectedFriends: () => void;
    onCloseClick: () => void;
}
