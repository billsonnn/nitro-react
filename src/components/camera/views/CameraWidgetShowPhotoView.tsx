import { FC, useEffect, useState } from "react"
import { IPhotoData, LocalizeText } from "../../../api"

export interface CameraWidgetShowPhotoViewProps
{
    currentIndex: number;
    currentPhotos: IPhotoData[];
}

export const CameraWidgetShowPhotoView: FC<CameraWidgetShowPhotoViewProps> = props =>
{
    const { currentIndex = -1, currentPhotos = null } = props
    const [ imageIndex, setImageIndex ] = useState(0)

    const currentImage = (currentPhotos && currentPhotos.length) ? currentPhotos[imageIndex] : null

    const next = () =>
    {
        setImageIndex(prevValue =>
        {
            let newIndex = (prevValue + 1)

            if(newIndex >= currentPhotos.length) newIndex = 0

            return newIndex
        })
    }

    const previous = () =>
    {
        setImageIndex(prevValue =>
        {
            let newIndex = (prevValue - 1)

            if(newIndex < 0) newIndex = (currentPhotos.length - 1)

            return newIndex
        })
    }

    useEffect(() =>
    {
        setImageIndex(currentIndex)
    }, [ currentIndex ])

    if(!currentImage) return null

    return (
        <div className="flex flex-col">
            <div className="size-80 border border-black" style={ currentImage.w ? { backgroundImage: "url(" + currentImage.w + ")" } : {} }>
                { !currentImage.w &&
                    <p className="text-center text-sm">{ LocalizeText("camera.loading") }</p> }
            </div>
            <p className="pt-1.5 text-right text-xs">{ new Date(currentImage.t * 1000).toLocaleDateString() }</p>
        </div>
    )
}
