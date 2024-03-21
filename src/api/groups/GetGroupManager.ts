import { CreateLinkEvent } from '@nitrots/nitro-renderer';

export function GetGroupManager(groupId: number): void
{
    CreateLinkEvent(`groups/manage/${ groupId }`);
}
