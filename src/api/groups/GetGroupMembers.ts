import { CreateLinkEvent } from '..';

export function GetGroupMembers(groupId: number): void
{
    CreateLinkEvent(`groups/members/${groupId}`);
}
