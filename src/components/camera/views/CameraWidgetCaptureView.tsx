import { GetRoomEngine, NitroRectangle, TextureUtils } from '@nitrots/nitro-renderer';
import { FC, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';
import { CameraPicture, GetRoomSession, LocalizeText, PlaySound, SoundNames } from '../../../api';
import { Button, Column, DraggableWindow } from '../../../common';
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
    };

    const takePicture = async () =>
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
        clone.push(new CameraPicture(texture, await TextureUtils.generateImageUrl(texture)));

        setCameraRoll(clone);
    };

    return (
        <DraggableWindow uniqueKey="nitro-camera-capture">
            <Column center className="relative" gap={ 0 }>
                { selectedPicture && <img alt="" className="absolute top-[37px] left-[10px] w-[320px] h-[320px]" src={ selectedPicture.imageUrl } /> }
                <div className="relative w-[340px] h-[462px] bg-[url('@/assets/images/room-widgets/camera-widget/camera-spritesheet.png')] bg-[-1px_-1px] drag-handler">
                    <div className="absolute top-[8px] right-[8px] rounded-[.25rem] [box-shadow:0_0_0_1.5px_#fff] border-[2px] border-[solid] border-[#921911] bg-[repeating-linear-gradient(rgb(245,_80,_65),_rgb(245,_80,_65)_50%,_rgb(194,_48,_39)_50%,_rgb(194,_48,_39)_100%)] cursor-pointer leading-none px-[3px] py-px" onClick={ onClose }>
                        <FaTimes className="fa-icon" />
                    </div>
                    { !selectedPicture && <div ref={ elementRef } className="absolute top-[37px] left-[10px] w-[320px] h-[320px] bg-[url('@/assets/images/room-widgets/camera-widget/camera-spritesheet.png')] bg-[-343px_-1px]" /> }
                    { selectedPicture &&
                        <div className="absolute top-[37px] left-[10px] w-[320px] h-[320px] ">
                            <div className="bg-[rgba(0,_0,_0,_0.5)] w-full absolute bottom-0 py-2 text-center inline-flex justify-center">
                                <Button className="me-3" title={ LocalizeText('camera.editor.button.tooltip') } variant="success" onClick={ onEdit }>{ LocalizeText('camera.editor.button.text') }</Button>
                                <Button variant="danger" onClick={ onDelete }>{ LocalizeText('camera.delete.button.text') }</Button>
                            </div>
                        </div> }
                    <div className="flex justify-center">
                        <div className="w-[94px] h-[94px] cursor-pointer mt-[362px] bg-[url('@/assets/images/room-widgets/camera-widget/camera-spritesheet.png')] bg-[-343px_-321px]" title={ LocalizeText('camera.take.photo.button.tooltip') } onClick={ takePicture } />
                    </div>
                </div>
                { (cameraRoll.length > 0) &&
                    <div className="w-[330px] bg-[#bab8b4] rounded-bl-[10px] rounded-br-[10px] border-[1px] border-[solid] border-[black] [box-shadow:inset_1px_0px_white,_inset_-1px_-1px_white] flex justify-center py-2">
                        { cameraRoll.map((picture, index) =>
                        {
                            return <img key={ index } alt="" className="w-[56px] h-[56px] border-[1px] border-[solid] border-[black] object-contain [image-rendering:initial]" src={ picture.imageUrl } onClick={ event => setSelectedPictureIndex(index) } />;
                        }) }
                    </div> }
            </Column>
        </DraggableWindow>
    );
};
