import { UserProfileComposer } from '@nitrots/nitro-renderer';
import { SendMessageHook } from '../../hooks';

export function GetUserProfile(userId: number): void
{
    SendMessageHook(new UserProfileComposer(userId));
}
