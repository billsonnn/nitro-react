import React, { FC } from 'react';
import { MessengerFriend } from '../../common/MessengerFriend';
import { MessengerRequest } from '../../common/MessengerRequest';
import { FriendsGroupItemView } from '../friends-group-item/FriendsGroupItemView';
import { FriendsRequestItemView } from '../friends-request-item/FriendsRequestItemView';
import { FriendsGroupViewProps } from './FriendsGroupView.types';

export const FriendsGroupView: FC<FriendsGroupViewProps> = props =>
{
    const { list =  null } = props;

    if(!list) return null;

    return (<>
        { list.map((item, index) =>
        {
            if(item instanceof MessengerFriend)
                return <FriendsGroupItemView key={ index } friend={ item } />
            else if(item instanceof MessengerRequest)
                return  <FriendsRequestItemView key={ index } request={ item } />
            else
                return null;
        }) }
    </>);
}
