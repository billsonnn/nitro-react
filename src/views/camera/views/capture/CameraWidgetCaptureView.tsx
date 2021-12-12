import { NitroRectangle, TextureUtils } from '@nitrots/nitro-renderer';
import { FC, useCallback, useRef } from 'react';
import { GetRoomEngine, GetRoomSession, LocalizeText } from '../../../../api';
import { CAMERA_SHUTTER, PlaySound } from '../../../../api/utils/PlaySound';
import { DraggableWindow } from '../../../../layout';
import { CameraPicture } from '../../common/CameraPicture';
import { useCameraWidgetContext } from '../../context/CameraWidgetContext';
import { CameraWidgetCaptureViewProps } from './CameraWidgetCaptureView.types';

const CAMERA_ROLL_LIMIT: number = 5;

export const CameraWidgetCaptureView: FC<CameraWidgetCaptureViewProps> = props =>
{
    const { onClose = null, onEdit = null, onDelete = null } = props;
    const { cameraRoll = null, setCameraRoll = null, selectedPictureIndex = -1, setSelectedPictureIndex = null } = useCameraWidgetContext();
    const elementRef = useRef<HTMLDivElement>();

    const selectedPicture = ((selectedPictureIndex > -1) ? cameraRoll[selectedPictureIndex] : null);

    const getCameraBounds = useCallback(() =>
    {
        if(!elementRef || !elementRef.current) return null;

        const frameBounds = elementRef.current.getBoundingClientRect();
        
        return new NitroRectangle(Math.floor(frameBounds.x), Math.floor(frameBounds.y), Math.floor(frameBounds.width), Math.floor(frameBounds.height));
    }, []);

    const takePicture = useCallback(() =>
    {
        if(selectedPictureIndex > -1)
        {
            setSelectedPictureIndex(-1);
            return;
        }

        const texture = GetRoomEngine().createTextureFromRoom(GetRoomSession().roomId, 1, getCameraBounds());

        const clone = [ ...cameraRoll ];

        if(clone.length >= CAMERA_ROLL_LIMIT)
        {
            alert(LocalizeText('camera.full.body'));

            clone.pop();
        }

        PlaySound(CAMERA_SHUTTER);
        clone.push(new CameraPicture(texture, TextureUtils.generateImageUrl(texture)));

        setCameraRoll(clone);
    }, [ cameraRoll, selectedPictureIndex, getCameraBounds, setCameraRoll, setSelectedPictureIndex ]);

    return (
        <DraggableWindow>
            <div className="d-flex flex-column justify-content-center align-items-center nitro-camera-capture">
                { selectedPicture && <img alt="" className="camera-area" src={ selectedPicture.imageUrl } /> }
                <div className="camera-canvas drag-handler">
                    <div className="position-absolute header-close" onClick={ onClose }>
                        <i className="fas fa-times" />
                    </div>
                    { !selectedPicture && <div ref={ elementRef } className="camera-area camera-view-finder" /> }
                    { selectedPicture && 
                        <div className="camera-area camera-frame">
                            <div className="camera-frame-preview-actions w-100 position-absolute bottom-0 py-2 text-center">
                                <button className="btn btn-success me-3" title={ LocalizeText('camera.editor.button.tooltip') } onClick={ onEdit }>{ LocalizeText('camera.editor.button.text') }</button>
                                <button className="btn btn-danger" onClick={ onDelete }>{ LocalizeText('camera.delete.button.text') }</button>
                            </div>
                        </div> }
                    <div className="d-flex justify-content-center">
                        <div className="camera-button" title={ LocalizeText('camera.take.photo.button.tooltip') } onClick={ takePicture } />
                    </div>
                </div>
                { (cameraRoll.length > 0) &&
                    <div className="camera-roll d-flex justify-content-center py-2">
                        { cameraRoll.map((picture, index) =>
                            {
                                return <img alt="" key={ index } className={ (index < (cameraRoll.length - 1) ? 'me-2' : '') } src={ picture.imageUrl } onClick={ event => setSelectedPictureIndex(index) } />;
                            }) }
                    </div> }
            </div>
        </DraggableWindow>
    );
}
