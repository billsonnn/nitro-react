import { FC } from 'react';
import { FriendsMessengerThreadGroup } from '../messenger-thread-group/FriendsMessengerThreadGroup';
import { FriendsMessengerThreadViewProps } from './FriendsMessengerThreadView.types';

export const FriendsMessengerThreadView: FC<FriendsMessengerThreadViewProps> = props =>
{
    const { thread = null } = props;

    return (
        <>
            { (thread.groups.length > 0) && thread.groups.map((group, index) =>
                {
                    return <FriendsMessengerThreadGroup key={ index } thread={ thread } group={ group } />;
                }) }
        </>
    );
}
