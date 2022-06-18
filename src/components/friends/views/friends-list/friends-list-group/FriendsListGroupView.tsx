import { FC } from 'react';
import { MessengerFriend } from '../../../../../api';
import { FriendsListGroupItemView } from './FriendsListGroupItemView';

interface FriendsListGroupViewProps
{
    list: MessengerFriend[];
    selectedFriendsIds: number[];
    selectFriend: (userId: number) => void;
}

export const FriendsListGroupView: FC<FriendsListGroupViewProps> = props =>
{
    const { list = null, selectedFriendsIds = null, selectFriend = null } = props;

    if(!list || !list.length) return null;

    return (
        <>
            { list.map((item, index) => <FriendsListGroupItemView key={ index } friend={ item } selected={ selectedFriendsIds && (selectedFriendsIds.indexOf(item.id) >= 0) } selectFriend={ selectFriend } />) }
        </>  
    );
}
