import { FC } from 'react';
import { MessengerFriend } from '../../../common/MessengerFriend';
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
            { list.map((item, index) => <FriendsListGroupItemView key={ index } friend={ item } selected={ selectedFriendsIds && selectedFriendsIds.includes(item.id) } selectFriend={ () => selectFriend(item.id) } />) }
        </>
        
    );
}
