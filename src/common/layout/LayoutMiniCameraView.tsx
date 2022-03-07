import { NitroRectangle, NitroRenderTexture } from '@nitrots/nitro-renderer';
import { FC, useCallback, useRef } from 'react';
import { GetRoomEngine, LocalizeText, SoundNames } from '../../api';
import { PlaySound } from '../../api/utils/PlaySound';
import { DraggableWindow } from '../draggable-window';

interface LayoutMiniCameraViewProps
{
    roomId: number;
    textureReceiver: (texture: NitroRenderTexture) => void;
    onClose: () => void;
}

export const LayoutMiniCameraView: FC<LayoutMiniCameraViewProps> = props =>
{
    const { roomId = -1, textureReceiver = null, onClose = null } = props;
    const elementRef = useRef<HTMLDivElement>();

    const getCameraBounds = useCallback(() =>
    {
        if(!elementRef || !elementRef.current) return null;

        const frameBounds = elementRef.current.getBoundingClientRect();
        
        return new NitroRectangle(Math.floor(frameBounds.x), Math.floor(frameBounds.y), Math.floor(frameBounds.width), Math.floor(frameBounds.height));
    }, []);

    const takePicture = useCallback(() =>
    {
        PlaySound(SoundNames.CAMERA_SHUTTER);
        textureReceiver(GetRoomEngine().createTextureFromRoom(roomId, 1, getCameraBounds()));
    }, [ roomId, getCameraBounds, textureReceiver ]);
    
    return (
        <DraggableWindow handleSelector=".nitro-room-thumbnail-camera">
            <div className="nitro-room-thumbnail-camera px-2">
                <div ref={ elementRef } className={ 'camera-frame' } />
                <div className="d-flex align-items-end h-100 pb-2">
                    <button className="btn btn-sm btn-danger w-100 mb-1 me-2" onClick={ onClose }>{ LocalizeText('cancel') }</button>
                    <button className="btn btn-sm btn-success w-100 mb-1" onClick={ takePicture }>{ LocalizeText('navigator.thumbeditor.save') }</button>
                </div>
            </div>
        </DraggableWindow>
    );
};
