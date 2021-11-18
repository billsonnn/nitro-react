import React, { FC } from 'react';
import { FriendsGroupItemView } from '../friends-group-item/FriendsGroupItemView';
import { FriendsGroupViewProps } from './FriendsGroupView.types';

export const FriendsGroupView: FC<FriendsGroupViewProps> = props =>
{
    const { list = null } = props;

    if(!list) return null;

    return (
        <>
            { list.map((item, index) =>
                {
                    return <FriendsGroupItemView key={ index } friend={ item } />;
                }) }
        </>
    );
}
