import { CreateLinkEvent } from '..';

export function OpenMessengerChat(friendId: number): void
{
    console.log(`friends/messenger/${friendId}`);
    CreateLinkEvent(`friends/messenger/${friendId}`);
}
