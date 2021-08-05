import { NitroTexture } from 'nitro-renderer';

export class CameraPicture
{
    constructor(
        public texture: NitroTexture,
        public imageUrl: string) {}
}
