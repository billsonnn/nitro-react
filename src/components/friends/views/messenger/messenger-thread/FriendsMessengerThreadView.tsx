import { FC } from 'react';
import { MessengerThread } from '../../../../../api';
import { FriendsMessengerThreadGroup } from './FriendsMessengerThreadGroup';

export const FriendsMessengerThreadView: FC<{ thread: MessengerThread }> = props =>
{
    const { thread = null } = props;

    thread.setRead();

    return (
        <>
            { (thread.groups.length > 0) && thread.groups.map((group, index) => <FriendsMessengerThreadGroup key={ index } group={ group } thread={ thread } />) }
        </>
    );
};
