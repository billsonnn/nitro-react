import { FC } from 'react';
import { MessengerFriend } from '../../common/MessengerFriend';
import { FriendsGroupItemView } from './FriendsGroupItemView';

interface FriendsGroupViewProps
{
    list: MessengerFriend[];
    selectedFriendsIds: number[];
    selectFriend: (userId: number) => void;
}

export const FriendsGroupView: FC<FriendsGroupViewProps> = props =>
{
    const { list = null, selectedFriendsIds = null, selectFriend = null } = props;

    if(!list) return null;

    return (
        <>
            { selectedFriendsIds && list && list.map((item, index) =>
                {
                    return <FriendsGroupItemView key={ index } friend={ item } selected={ selectedFriendsIds.includes(item.id) } selectFriend={ () => selectFriend(item.id) } />;
                }) }
        </>
    );
}
