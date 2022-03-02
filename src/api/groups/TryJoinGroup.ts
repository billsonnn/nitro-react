import { GroupJoinComposer } from '@nitrots/nitro-renderer';
import { SendMessageHook } from '../../hooks';

export const TryJoinGroup = (groupId: number) => SendMessageHook(new GroupJoinComposer(groupId));
