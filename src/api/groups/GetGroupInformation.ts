import { GroupInformationComposer } from '@nitrots/nitro-renderer';
import { SendMessageComposer } from '../nitro';

export function GetGroupInformation(groupId: number): void
{
    SendMessageComposer(new GroupInformationComposer(groupId, true));
}
