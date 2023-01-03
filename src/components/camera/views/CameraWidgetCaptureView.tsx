import { NitroRectangle, TextureUtils } from '@nitrots/nitro-renderer';
import { FC, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';
import { CameraPicture, GetRoomEngine, GetRoomSession, LocalizeText, PlaySound, SoundNames } from '../../../api';
import { Column, DraggableWindow, Flex } from '../../../common';
import { useCamera, useNotification } from '../../../hooks';

export interface CameraWidgetCaptureViewProps
{
    onClose: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

const CAMERA_ROLL_LIMIT: number = 5;

export const CameraWidgetCaptureView: FC<CameraWidgetCaptureViewProps> = props =>
{
    const { onClose = null, onEdit = null, onDelete = null } = props;
    const { cameraRoll = null, setCameraRoll = null, selectedPictureIndex = -1, setSelectedPictureIndex = null } = useCamera();
    const { simpleAlert = null } = useNotification();
    const elementRef = useRef<HTMLDivElement>();

    const selectedPicture = ((selectedPictureIndex > -1) ? cameraRoll[selectedPictureIndex] : null);

    const getCameraBounds = () =>
    {
        if(!elementRef || !elementRef.current) return null;

        const frameBounds = elementRef.current.getBoundingClientRect();
        
        return new NitroRectangle(Math.floor(frameBounds.x), Math.floor(frameBounds.y), Math.floor(frameBounds.width), Math.floor(frameBounds.height));
    }

    const takePicture = () =>
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
            simpleAlert(LocalizeText('camera.full.body'));

            clone.pop();
        }

        PlaySound(SoundNames.CAMERA_SHUTTER);
        clone.push(new CameraPicture(texture, TextureUtils.generateImageUrl(texture)));

        setCameraRoll(clone);
    }

    return (
        <DraggableWindow uniqueKey="nitro-camera-capture">
            <Column center className="nitro-camera-capture" gap={ 0 }>
                { selectedPicture && <img alt="" className="camera-area" src={ selectedPicture.imageUrl } /> }
                <div className="camera-canvas drag-handler">
                    <div className="position-absolute header-close" onClick={ onClose }>
                        <FaTimes className="fa-icon" />
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
                    <Flex gap={ 2 } justifyContent="center" className="camera-roll d-flex justify-content-center py-2">
                        { cameraRoll.map((picture, index) =>
                        {
                            return <img alt="" key={ index } src={ picture.imageUrl } onClick={ event => setSelectedPictureIndex(index) } />;
                        }) }
                    </Flex> }
            </Column>
        </DraggableWindow>
    );
}
