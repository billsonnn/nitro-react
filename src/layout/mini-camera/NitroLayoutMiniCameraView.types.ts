import { NitroRenderTexture } from '@nitrots/nitro-renderer';

export interface NitroLayoutMiniCameraViewProps
{
    roomId: number;
    textureReceiver: (texture: NitroRenderTexture) => void;
    onClose: () => void;
}
