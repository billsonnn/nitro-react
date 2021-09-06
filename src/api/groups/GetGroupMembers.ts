import { CreateLinkEvent } from '..';

export function GetGroupMembers(groupId: number, levelId?: number): void
{
    if(!levelId) CreateLinkEvent(`groups/members/${groupId}`);
    else CreateLinkEvent(`groups/members/${groupId}/${levelId}`);
}
