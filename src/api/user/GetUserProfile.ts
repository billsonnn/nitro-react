import { UserProfileComposer } from '@nitrots/nitro-renderer';
import { SendMessageComposer } from '../nitro';

export function GetUserProfile(userId: number): void
{
    SendMessageComposer(new UserProfileComposer(userId));
}
