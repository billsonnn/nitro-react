import { IAvatarRenderManager } from 'nitro-renderer';
import { GetNitroInstance } from '../GetNitroInstance';

export function GetAvatarRenderManager(): IAvatarRenderManager
{
    return GetNitroInstance().avatar;
}
