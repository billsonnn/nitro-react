import { AvatarDirectionAngle } from "@nitrots/nitro-renderer"
import { FC, useEffect, useState } from "react"
import { FigureData } from "../../../api"
import { LayoutAvatarImageView } from "../../../common"

export interface AvatarEditorFigurePreviewViewProps
{
    figureData: FigureData;
}

export const AvatarEditorFigurePreviewView: FC<AvatarEditorFigurePreviewViewProps> = props =>
{
    const { figureData = null } = props
    const [ updateId, setUpdateId ] = useState(-1)

    const rotateFigure = (direction: number) =>
    {
        if(direction < AvatarDirectionAngle.MIN_DIRECTION)
        {
            direction = (AvatarDirectionAngle.MAX_DIRECTION + (direction + 1))
        }

        if(direction > AvatarDirectionAngle.MAX_DIRECTION)
        {
            direction = (direction - (AvatarDirectionAngle.MAX_DIRECTION + 1))
        }

        figureData.direction = direction
    }

    useEffect(() =>
    {
        if(!figureData) return

        figureData.notify = () => setUpdateId(prevValue => (prevValue + 1))

        return () =>
        {
            figureData.notify = null
        }
    }, [ figureData ])

    return (
        <div className="illumina-previewer relative flex h-[275px] w-full flex-col items-center justify-center overflow-hidden">
            <div className="-translate-y-4">
                <LayoutAvatarImageView figure={ figureData.getFigureString() } direction={ figureData.direction } scale={ 2 } />
            </div>
            <div className="absolute bottom-4 z-10">
                <i className="block bg-[url('/client-assets/images/avatar-editor/spritesheet.png?v=2451779')] self-center dark:bg-[url('/client-assets/images/avatar-editor/spritesheet-dark.png?v=2451779')] bg-[-284px_-43px] w-[44px] h-[29px] cursor-pointer" onClick={ event => rotateFigure(figureData.direction + 1) } />
            </div>
        </div>
    )
}
