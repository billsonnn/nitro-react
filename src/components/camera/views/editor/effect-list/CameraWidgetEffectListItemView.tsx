import { IRoomCameraWidgetEffect } from "@nitrots/nitro-renderer"
import { FC } from "react"

export interface CameraWidgetEffectListItemViewProps
{
    effect: IRoomCameraWidgetEffect;
    thumbnailUrl: string;
    isActive: boolean;
    isLocked: boolean;
    selectEffect: () => void;
    removeEffect: () => void;
}

export const CameraWidgetEffectListItemView: FC<CameraWidgetEffectListItemViewProps> = props =>
{
    const { effect = null, thumbnailUrl = null, isActive = false, isLocked = false, selectEffect = null, removeEffect = null } = props

    return (
        <div className="relative flex size-[62px] cursor-pointer items-center justify-center bg-[url('/client-assets/images/camera/spritesheet.png?v=2451779')] bg-[-405px_-474px]" onClick={ event => (!isActive && selectEffect()) }>
            { !isLocked && (thumbnailUrl && thumbnailUrl.length > 0) &&
                <div className="z-0 size-14 bg-cover bg-center" style={{ backgroundImage: `url(${thumbnailUrl})` }} /> }
            { isActive &&
                <div className="absolute size-[62px]">
                    <i className="absolute right-0 top-0 z-20 size-[19px] bg-[url('/client-assets/images/camera/spritesheet.png?v=2451779')] bg-[-468px_-476px]" onClick={ removeEffect } />
                    <div className="absolute left-0 top-0 size-full rounded-lg bg-[#ffffff40]" />
                    <div className="absolute left-0 top-0 z-10 size-full bg-[url('/client-assets/images/camera/spritesheet.png?v=2451779')] bg-[-342px_-474px]" />
                </div> }
        </div>
    )
}
