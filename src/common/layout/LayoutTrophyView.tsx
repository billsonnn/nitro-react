import { FC } from "react"
import { LocalizeText } from "../../api"
import { DraggableWindow } from "../draggable-window"

interface LayoutTrophyViewProps
{
    color: number | string;
    message: string;
    date: string;
    senderName: string;
    customTitle?: string;
    onCloseClick: () => void;
}

export const LayoutTrophyView: FC<LayoutTrophyViewProps> = props =>
{
    const { color = "", message = "", date = "", senderName = "", customTitle = null, onCloseClick = null } = props

    const getTrophyView = () =>
    {
        let bg = ""

        if(color === 1)
        {
            bg = "bg-[0px_0px] [text-shadow:_0_1px_0_#F4C52F]"
        }
        else if(color === 2)
        {
            bg = "bg-[0px_-346px] [text-shadow:_0_1px_0_#cfcfcf]"
        }
        else if(color === 3)
        {
            bg = "bg-[0px_-173px] [text-shadow:_0_1px_0_#c17725]"
        }
        
        return bg
    }

    return (
        <DraggableWindow handleSelector=".nitro-trophy">
            <div className={ `nitro-trophy flex h-[173px] w-[340px] flex-col justify-between bg-[url('/client-assets/images/room-widgets/trophy/spritesheet.png?v=2451779')] p-1.5 ${ getTrophyView() }` }>
                <div className="relative flex h-[15px] items-center justify-center">
                    <button className="absolute right-0 h-[15px] w-[13px] cursor-pointer" onClick={ onCloseClick } />
                    <p className="text-sm font-semibold !text-black">{ LocalizeText("widget.furni.trophy.title") }</p>
                </div>
                <div className="flex h-full flex-col px-[19px] py-2">
                    <div className="h-[98px] overflow-hidden">
                        { customTitle && <p className="text-sm font-semibold !text-black">{ customTitle }</p> }
                        <p className="text-sm !text-black">{ message }</p>
                    </div>
                    <div className="mt-4 flex h-[17px] items-center justify-between">
                        <p className="text-sm font-semibold !text-black">{ date }</p>
                        <p className="text-sm font-semibold !text-black">{ senderName }</p>
                    </div>
                </div>
            </div>
        </DraggableWindow>
    )
}
