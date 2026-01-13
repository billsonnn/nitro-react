import { MouseEventType, RoomObjectCategory } from "@nitrots/nitro-renderer"
import { Dispatch, FC, PropsWithChildren, SetStateAction, useEffect, useRef } from "react"
import { CreateLinkEvent, DispatchUiEvent, GetConfiguration, GetRoomEngine, GetRoomSession, GetSessionDataManager, GetUserProfile, LocalizeText } from "../../api"
import { LayoutItemCountView } from "../../common"
import { GuideToolEvent } from "../../events"

interface ToolbarMeViewProps
{
    useGuideTool: boolean;
    unseenAchievementCount: number;
    setMeExpanded: Dispatch<SetStateAction<boolean>>;
}

export const ToolbarMeView: FC<PropsWithChildren<ToolbarMeViewProps>> = props =>
{
    const { useGuideTool = false, unseenAchievementCount = 0, setMeExpanded = null, children = null, ...rest } = props
    const elementRef = useRef<HTMLDivElement>()

    useEffect(() =>
    {
        const roomSession = GetRoomSession()

        if(!roomSession) return

        GetRoomEngine().selectRoomObject(roomSession.roomId, roomSession.ownRoomIndex, RoomObjectCategory.UNIT)
    }, [])

    useEffect(() =>
    {
        const onClick = (event: MouseEvent) => setMeExpanded(false)

        document.addEventListener("click", onClick)

        return () => document.removeEventListener(MouseEventType.MOUSE_CLICK, onClick)
    }, [ setMeExpanded ])

    return (
        <div ref={ elementRef } className="illumina-toolbar-me absolute bottom-[60px] left-2.5 z-20 flex items-center gap-4 px-3.5 pb-1 pt-2">
            { (GetConfiguration("guides.enabled") && useGuideTool) &&
                <div className="group flex cursor-pointer flex-col items-center" onClick={ event => DispatchUiEvent(new GuideToolEvent(GuideToolEvent.TOGGLE_GUIDE_TOOL)) }>
                    <i className="h-[29px] w-[26px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-89px_-83px] grayscale group-hover:grayscale-0" />
                    <p className="mt-1 max-w-[50px] truncate text-clip text-[11px] text-[#FEFEFE] group-hover:text-[#21B9D8]">{ LocalizeText("widget.memenu.guide") }</p>
                </div> }
            <div className="group flex cursor-pointer flex-col items-center" onClick={ event => CreateLinkEvent("achievements/toggle") }>
                <div className="relative h-[30px] w-[31px]">
                    <i className="block size-full bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[0px_-83px] grayscale group-hover:grayscale-0" />
                    { (unseenAchievementCount > 0) &&
                        <LayoutItemCountView count={ unseenAchievementCount } /> }
                </div>
                <p className="mt-1 truncate text-clip text-[11px] text-[#FEFEFE] group-hover:text-[#21B9D8]">{ LocalizeText("widget.memenu.achievements") }</p>
            </div>
            <div className="group flex cursor-pointer flex-col items-center" onClick={ event => GetUserProfile(GetSessionDataManager().userId) }>
                <i className="h-[30px] w-8 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-147px_-83px] grayscale group-hover:grayscale-0" />
                <p className="mt-1 truncate text-clip text-[11px] text-[#FEFEFE] group-hover:text-[#21B9D8]">{ LocalizeText("widget.memenu.profile") }</p>
            </div>
            <div className="group flex cursor-pointer flex-col items-center" onClick={ event => CreateLinkEvent("navigator/search/myworld_view") }>
                <i className="size-[30px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-116px_-83px] grayscale group-hover:grayscale-0" />
                <p className="mt-1 truncate text-clip text-[11px] text-[#FEFEFE] group-hover:text-[#21B9D8]">{ LocalizeText("widget.memenu.myrooms") }</p>
            </div>
            <div className="group flex cursor-pointer flex-col items-center" onClick={ event => CreateLinkEvent("avatar-editor/toggle") }>
                <i className="h-[30px] w-[27px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-31px_-83px] grayscale group-hover:grayscale-0" />
                <p className="mt-1 max-w-[60px] truncate text-clip text-[11px] text-[#FEFEFE] group-hover:text-[#21B9D8]">{ LocalizeText("widget.memenu.editavatar") }</p>
            </div>
            <div className="group flex cursor-pointer flex-col items-center" onClick={ event => CreateLinkEvent("user-settings/toggle") }>
                <i className="h-[34px] w-7 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-60px_-83px] grayscale group-hover:grayscale-0" />
                <p className="mt-1 truncate text-clip text-[11px] text-[#FEFEFE] group-hover:text-[#21B9D8]">{ LocalizeText("widget.memenu.settings") }</p>
            </div>
            { children }
        </div>
    )
}
