import { GetRoomEngine, NitroRectangle, NitroTexture } from '@nitrots/nitro-renderer';
import { FC, useRef } from 'react';
import { LocalizeText, PlaySound, SoundNames } from '../../api';
import { DraggableWindow } from '../draggable-window';

interface LayoutMiniCameraViewProps
{
    roomId: number;
    textureReceiver: (texture: NitroTexture) => Promise<void>;
    onClose: () => void;
}

export const LayoutMiniCameraView: FC<LayoutMiniCameraViewProps> = props =>
{
    const { roomId = -1, textureReceiver = null, onClose = null } = props;
    const elementRef = useRef<HTMLDivElement>();

    const getCameraBounds = () =>
    {
        if(!elementRef || !elementRef.current) return null;

        const frameBounds = elementRef.current.getBoundingClientRect();

        return new NitroRectangle(Math.floor(frameBounds.x), Math.floor(frameBounds.y), Math.floor(frameBounds.width), Math.floor(frameBounds.height));
    };

    const takePicture = () =>
    {
        PlaySound(SoundNames.CAMERA_SHUTTER);
        textureReceiver(GetRoomEngine().createTextureFromRoom(roomId, 1, getCameraBounds()));
    };

    return (
        <DraggableWindow handleSelector=".nitro-room-thumbnail-camera">
            <div className="nitro-room-thumbnail-camera px-2">
                <div ref={ elementRef } className={ 'camera-frame' } />
                <div className="flex align-items-end h-full pb-2">
                    <button className="btn btn-sm btn-danger w-full mb-1 me-2" onClick={ onClose }>{ LocalizeText('cancel') }</button>
                    <button className="btn btn-sm btn-success w-full mb-1" onClick={ takePicture }>{ LocalizeText('navigator.thumbeditor.save') }</button>
                </div>
            </div>
        </DraggableWindow>
    );
};
