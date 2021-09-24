import { CreateLinkEvent } from '..';

export function OpenMessengerChat(friendId: number = -1): void
{
    if(friendId === -1) CreateLinkEvent('friends/messenger/open');
    else CreateLinkEvent(`friends/messenger/${friendId}`);
}
