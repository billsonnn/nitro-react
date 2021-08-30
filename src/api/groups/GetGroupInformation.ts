import { GroupInformationComposer } from '@nitrots/nitro-renderer';
import { SendMessageHook } from '../../hooks';

export function GetGroupInformation(groupId: number): void
{
    SendMessageHook(new GroupInformationComposer(groupId, true));
}
