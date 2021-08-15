import { IAvatarRenderManager } from '@nitrots/nitro-renderer';
import { GetNitroInstance } from '../GetNitroInstance';

export function GetAvatarRenderManager(): IAvatarRenderManager
{
    return GetNitroInstance().avatar;
}
