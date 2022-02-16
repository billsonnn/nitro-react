import React, { FC } from 'react';
import { FriendsGroupItemView } from '../friends-group-item/FriendsGroupItemView';
import { FriendsGroupViewProps } from './FriendsGroupView.types';

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
