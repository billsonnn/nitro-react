import React, { FC } from 'react';
import { MessengerFriend } from '../../common/MessengerFriend';
import { MessengerRequest } from '../../common/MessengerRequest';
import { FriendsListItemView } from '../friend-item/FriendsListItemView';
import { FriendsRequestItemView } from '../request-item/FriendsRequestItemView';
import { FriendsListViewProps } from './FriendsListView.types';

export const FriendsListView: FC<FriendsListViewProps> = props =>
{
    const { list =  null } = props;

    if(!list) return null;

    return (<>
        { list.map((item, index) =>
        {
            if(item instanceof MessengerFriend)
                return <FriendsListItemView key={ index } friend={ item } />
            else if(item instanceof MessengerRequest)
                return  <FriendsRequestItemView key={ index } request={ item } />
            else
                return null;
        }) }
    </>);
}
