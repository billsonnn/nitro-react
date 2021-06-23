import { FC } from 'react';
import { FriendBarItemViewProps } from './FriendBarItemView.types';

export const FriendBarItemView: FC<FriendBarItemViewProps> = props =>
{
    const { friend = null } = props;

    if(!friend)
    {
        return (
            <div>offline</div>
        );
    }

    return (
        <div>{ friend.name }</div>
    );
}
