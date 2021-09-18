import { CreateLinkEvent } from '..';

export function OpenMessengerChat(friendId: number): void
{
    CreateLinkEvent(`friends/messenger/${friendId}`);
}
