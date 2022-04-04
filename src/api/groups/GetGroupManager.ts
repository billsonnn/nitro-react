import { CreateLinkEvent } from '..';

export function GetGroupManager(groupId: number): void
{
    CreateLinkEvent(`groups/manage/${ groupId }`);
}
