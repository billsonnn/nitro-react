import { GroupJoinComposer } from '@nitrots/nitro-renderer';
import { SendMessageHook } from '../../hooks';

export function TryJoinGroup(groupId: number): void
{
    SendMessageHook(new GroupJoinComposer(groupId));
}
