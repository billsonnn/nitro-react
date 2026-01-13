import { NitroRectangle, NitroRenderTexture } from "@nitrots/nitro-renderer"
import { FC, useRef } from "react"
import { GetRoomEngine, LocalizeText, PlaySound, SoundNames } from "../../api"
import { Button } from "../Button"
import { DraggableWindow } from "../draggable-window"

interface LayoutMiniCameraViewProps
{
    roomId: number;
    textureReceiver: (texture: NitroRenderTexture) => void;
    onClose: () => void;
}

export const LayoutMiniCameraView: FC<LayoutMiniCameraViewProps> = props =>
{
    const { roomId = -1, textureReceiver = null, onClose = null } = props
    const elementRef = useRef<HTMLDivElement>()

    const getCameraBounds = () =>
    {
        if(!elementRef || !elementRef.current) return null

        const frameBounds = elementRef.current.getBoundingClientRect()
        
        return new NitroRectangle(Math.floor(frameBounds.x), Math.floor(frameBounds.y), Math.floor(frameBounds.width), Math.floor(frameBounds.height))
    }

    const takePicture = () =>
    {
        PlaySound(SoundNames.CAMERA_SHUTTER)
        textureReceiver(GetRoomEngine().createTextureFromRoom(roomId, 1, getCameraBounds()))
    }
    
    return (
        <DraggableWindow handleSelector=".illumina-room-thumbnail-camera">
            <div className="illumina-room-thumbnail-camera px-2">
                <i className="absolute right-3 top-2.5 size-[11px] cursor-pointer bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-63px_-207px] bg-no-repeat" onClick={ onClose } />
                <div ref={ elementRef } className="absolute ml-[3px] mt-[30px] size-[110px]" />
                <div className="flex h-full items-end justify-center gap-2 pb-3">
                    <Button variant="success" className="!px-3" onClick={ takePicture }>{ LocalizeText("navigator.thumbeditor.save") }</Button>
                </div>
            </div>
        </DraggableWindow>
    )
}
