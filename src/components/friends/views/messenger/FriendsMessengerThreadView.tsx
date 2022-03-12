import { FC } from 'react';
import { MessengerThread } from '../../common/MessengerThread';
import { FriendsMessengerThreadGroup } from './FriendsMessengerThreadGroup';

interface FriendsMessengerThreadViewProps
{
    thread: MessengerThread;
}

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
