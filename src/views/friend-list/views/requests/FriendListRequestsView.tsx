import { FC } from 'react';
import { FriendListRequestsItemView } from '../requests-item/FriendListRequestsItemView';
import { FriendListRequestsViewProps } from './FriendListRequestsView.types';

export const FriendListRequestsView: FC<FriendListRequestsViewProps> = props =>
{
    const { list = null } = props;

    if(!list) return null;

    return (<>
        { list.map((request, index) =>
        {
            return <FriendListRequestsItemView key={ index } request={ request } />
        }) }
    </>);
};
