import { IAvatarRenderManager, Nitro } from 'nitro-renderer';

export function GetAvatarRenderManager(): IAvatarRenderManager
{
    return Nitro.instance.avatar;
}
