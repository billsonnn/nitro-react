import { NitroRectangle, TextureUtils } from "@nitrots/nitro-renderer"
import { FC, useRef } from "react"
import { CameraPicture, GetRoomEngine, GetRoomSession, LocalizeText, PlaySound, SoundNames } from "../../../api"
import { Button, DraggableWindow } from "../../../common"
import { useCamera, useNotification } from "../../../hooks"

export interface CameraWidgetCaptureViewProps
{
    onClose: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

const CAMERA_ROLL_LIMIT: number = 5

export const CameraWidgetCaptureView: FC<CameraWidgetCaptureViewProps> = props =>
{
    const { onClose = null, onEdit = null, onDelete = null } = props
    const { cameraRoll = null, setCameraRoll = null, selectedPictureIndex = -1, setSelectedPictureIndex = null } = useCamera()
    const { simpleAlert = null } = useNotification()
    const elementRef = useRef<HTMLDivElement>()

    const selectedPicture = ((selectedPictureIndex > -1) ? cameraRoll[selectedPictureIndex] : null)

    const getCameraBounds = () =>
    {
        if(!elementRef || !elementRef.current) return null

        const frameBounds = elementRef.current.getBoundingClientRect()
        
        return new NitroRectangle(Math.floor(frameBounds.x), Math.floor(frameBounds.y), Math.floor(frameBounds.width), Math.floor(frameBounds.height))
    }

    const takePicture = () =>
    {
        if(selectedPictureIndex > -1)
        {
            setSelectedPictureIndex(-1)
            return
        }

        const texture = GetRoomEngine().createTextureFromRoom(GetRoomSession().roomId, 1, getCameraBounds())

        const clone = [ ...cameraRoll ]

        if(clone.length >= CAMERA_ROLL_LIMIT)
        {
            simpleAlert(LocalizeText("camera.full.body"))

            clone.pop()
        }

        PlaySound(SoundNames.CAMERA_SHUTTER)
        clone.push(new CameraPicture(texture, TextureUtils.generateImageUrl(texture)))

        setCameraRoll(clone)
    }

    return (
        <DraggableWindow uniqueKey="nitro-camera-capture">
            <div className="flex flex-col">
                { selectedPicture && <img alt="" className="absolute left-2.5 top-[37px] size-80" src={ selectedPicture.imageUrl } /> }
                <div className="drag-handler relative z-[2] h-[462px] w-[340px] bg-[url('/client-assets/images/camera/spritesheet.png?v=2451779')] bg-[-1px_-1px]">
                    <i className="absolute right-3 top-3 size-[11px] cursor-pointer bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-63px_-207px] bg-no-repeat" onClick={ onClose } />
                    { !selectedPicture && <div ref={ elementRef } className="absolute left-2.5 top-[37px] size-80 bg-[url('/client-assets/images/camera/spritesheet.png?v=2451779')] bg-[-343px_-1px]" /> }
                    { selectedPicture && 
                        <div className="absolute bottom-[106px] left-[11px] flex h-[58px] w-[318px] items-center justify-center bg-[#00000080]">
                            <Button variant="success" className="h-10" title={ LocalizeText("camera.editor.button.tooltip") } onClick={ onEdit }>{ LocalizeText("camera.editor.button.text") }</Button>
                        </div> }
                    <div className="flex justify-center">
                        <div className="mt-[362px] size-[94px] cursor-pointer bg-[url('/client-assets/images/camera/spritesheet.png?v=2451779')] bg-[-343px_-321px] hover:bg-[-535px_-321px] active:bg-[-439px_-321px]" title={ LocalizeText("camera.take.photo.button.tooltip") } onClick={ takePicture } />
                    </div>
                </div>
                { (cameraRoll.length > 0) &&
                    <div className="flex h-[73px] w-[340px] gap-[3px] bg-[url('/client-assets/images/camera/spritesheet.png?v=2451779')] bg-[-1px_-463px] px-3 py-[3px]">
                        { cameraRoll.map((picture, index) => (
                            <div key={ index } className="relative flex size-[62px] cursor-pointer items-center justify-center bg-[url('/client-assets/images/camera/spritesheet.png?v=2451779')] bg-[-405px_-474px]" onClick={ event => setSelectedPictureIndex(index) } >
                                <div className="z-0 size-14 bg-cover bg-center" style={{ backgroundImage: `url(${picture.imageUrl})` }} />
                                { selectedPictureIndex === index &&
                                    <div className="absolute size-[62px]">
                                        <i className="absolute right-0 top-0 z-20 size-[19px] bg-[url('/client-assets/images/camera/spritesheet.png?v=2451779')] bg-[-468px_-476px]" onClick={ onDelete } />
                                        <div className="absolute left-0 top-0 size-full rounded-lg bg-[#ffffff40]" />
                                        <div className="absolute left-0 top-0 z-10 size-full bg-[url('/client-assets/images/camera/spritesheet.png?v=2451779')] bg-[-342px_-474px]" />
                                    </div> }
                            </div>
                        ))}
                    </div> }
            </div>
        </DraggableWindow>
    )
}
