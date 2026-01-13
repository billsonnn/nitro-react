import { Dispose, DropBounce, EaseOut, JumpBy, Motions, NitroToolbarAnimateIconEvent, PerkAllowancesMessageEvent, PerkEnum, Queue, Wait } from "@nitrots/nitro-renderer"
import { FC, useState } from "react"
import { CreateLinkEvent, GetConfiguration, GetSessionDataManager, VisitDesktop } from "../../api"
import { LayoutAvatarImageView, LayoutItemCountView, TransitionAnimation, TransitionAnimationTypes } from "../../common"
import { useAchievements, useFriends, useInventoryUnseenTracker, useMessageEvent, useRoomEngineEvent, useSessionInfo } from "../../hooks"
import { ToolbarMeView } from "./ToolbarMeView"

const LeftToolbarView: FC<{}> = props => {
    return (
        <div>

        </div>
    )
}

export const ToolbarView: FC<{ isInRoom: boolean }> = props =>
{
    const { isInRoom } = props
    const [ isMeExpanded, setMeExpanded ] = useState(false)
    const [ useGuideTool, setUseGuideTool ] = useState(false)
    const { userFigure = null } = useSessionInfo()
    const { getFullCount = 0 } = useInventoryUnseenTracker()
    const { getTotalUnseen = 0 } = useAchievements()
    const { requests = [] } = useFriends()

    const isMod = GetSessionDataManager().isModerator
    const toolbarType = GetConfiguration<string>("illumina.toolbar.type")
    const cameraEnabled = GetConfiguration<boolean>("illumina.camera.enabled", false)
    const modToolsClosable: boolean = GetConfiguration<boolean>("illumina.mod_tools.closable")
    const gameCenterEnabled: boolean = GetConfiguration<boolean>("game.center.enabled")
    
    useMessageEvent<PerkAllowancesMessageEvent>(PerkAllowancesMessageEvent, event =>
    {
        const parser = event.getParser()

        setUseGuideTool(parser.isAllowed(PerkEnum.USE_GUIDE_TOOL))
    })

    useRoomEngineEvent<NitroToolbarAnimateIconEvent>(NitroToolbarAnimateIconEvent.ANIMATE_ICON, event =>
    {
        const animationIconToToolbar = (iconName: string, image: HTMLImageElement, x: number, y: number) =>
        {
            const target = (document.body.getElementsByClassName(iconName)[0] as HTMLElement)

            if(!target) return
            
            image.className = "toolbar-icon-animation"
            image.style.visibility = "visible"
            image.style.left = (x + "px")
            image.style.top = (y + "px")

            document.body.append(image)

            const targetBounds = target.getBoundingClientRect()
            const imageBounds = image.getBoundingClientRect()

            const left = (imageBounds.x - targetBounds.x)
            const top = (imageBounds.y - targetBounds.y)
            const squared = Math.sqrt(((left * left) + (top * top)))
            const wait = (500 - Math.abs(((((1 / squared) * 100) * 500) * 0.5)))
            const height = 20

            const motionName = (`ToolbarBouncing[${ iconName }]`)

            if(!Motions.getMotionByTag(motionName))
            {
                Motions.runMotion(new Queue(new Wait((wait + 8)), new DropBounce(target, 400, 12))).tag = motionName
            }

            const motion = new Queue(new EaseOut(new JumpBy(image, wait, ((targetBounds.x - imageBounds.x) + height), (targetBounds.y - imageBounds.y), 100, 1), 1), new Dispose(image))

            Motions.runMotion(motion)
        }

        animationIconToToolbar("icon-inventory", event.image, event.x, event.y)
    })

    return (
        <>
            { toolbarType === "left" &&
                <div className="absolute left-0 top-0 z-30 pt-[150px]">
                    <div className="illumina-toolbar-left">
                        { isInRoom
                            ? <div className="illumina-toolbar-left-item" onClick={ event => VisitDesktop() }>
                                <i className="relative block size-7 cursor-pointer bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-0px_-49px] drop-shadow-[1px_1px_0_#46423E] hover:-translate-x-px hover:-translate-y-px hover:drop-shadow-[2px_2px_0_#46423E] active:translate-x-0 active:translate-y-0 active:brightness-90 active:drop-shadow-[1px_1px_0_#46423E]" />
                            </div>
                            : <div className="illumina-toolbar-left-item" onClick={ event => CreateLinkEvent("navigator/goto/home") }>
                                <i className="relative block h-[30px] w-8 cursor-pointer bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-29px_-49px] drop-shadow-[1px_1px_0_#46423E] hover:-translate-x-px hover:-translate-y-px hover:drop-shadow-[2px_2px_0_#46423E] active:translate-x-0 active:translate-y-0 active:brightness-90 active:drop-shadow-[1px_1px_0_#46423E]" />
                            </div>
                        }
                        <div className="illumina-toolbar-left-item-line" />
                        <div className="illumina-toolbar-left-item" onClick={ event => CreateLinkEvent("navigator/toggle") }>
                            <i className="relative block size-8 cursor-pointer bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-91px_-49px] drop-shadow-[1px_1px_0_#46423E] hover:-translate-x-px hover:-translate-y-px hover:drop-shadow-[2px_2px_0_#46423E] active:translate-x-0 active:translate-y-0 active:brightness-90 active:drop-shadow-[1px_1px_0_#46423E]" />
                        </div>
                        <div className="illumina-toolbar-left-item-line" />
                        { gameCenterEnabled && <>
                            <div className="illumina-toolbar-left-item" onClick={ event => CreateLinkEvent("games/show") }>
                                <i className="relative block w-[37px] h-6 cursor-pointer bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-156px_-288px] drop-shadow-[1px_1px_0_#46423E] hover:-translate-x-px hover:-translate-y-px hover:drop-shadow-[2px_2px_0_#46423E] active:translate-x-0 active:translate-y-0 active:brightness-90 active:drop-shadow-[1px_1px_0_#46423E]" />
                            </div>
                            <div className="illumina-toolbar-left-item-line" />
                        </> }
                        <div className="illumina-toolbar-left-item" onClick={ event => CreateLinkEvent("catalog/toggle") }>
                            <i className="-ml-1.5 relative block size-8 cursor-pointer bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-124px_-49px] drop-shadow-[1px_1px_0_#46423E] hover:-translate-x-px hover:-translate-y-px hover:drop-shadow-[2px_2px_0_#46423E] active:translate-x-0 active:translate-y-0 active:brightness-90 active:drop-shadow-[1px_1px_0_#46423E]" />
                        </div>
                        <div className="illumina-toolbar-left-item-line" />
                        <div className="illumina-toolbar-left-item" onClick={ event => CreateLinkEvent("inventory/toggle") }>
                            <i className="relative block h-[29px] w-7 cursor-pointer bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-62px_-49px] drop-shadow-[1px_1px_0_#46423E] hover:-translate-x-px hover:-translate-y-px hover:drop-shadow-[2px_2px_0_#46423E] active:translate-x-0 active:translate-y-0 active:brightness-90 active:drop-shadow-[1px_1px_0_#46423E]">
                                { (getFullCount > 0) && <LayoutItemCountView count={ getFullCount } /> }
                            </i>
                        </div>
                        { (isMod && modToolsClosable) && <>
                            <div className="illumina-toolbar-left-item-line" />
                            <div className="illumina-toolbar-left-item" onClick={ event => CreateLinkEvent("mod-tools/toggle") }>
                                <i className="relative block size-[31px] cursor-pointer bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-158px_-49px] drop-shadow-[1px_1px_0_#46423E] hover:-translate-x-px hover:-translate-y-px hover:drop-shadow-[2px_2px_0_#46423E] active:translate-x-0 active:translate-y-0 active:brightness-90 active:drop-shadow-[1px_1px_0_#46423E]" />
                            </div>
                        </> }
                    </div>
                </div> }
            <div id="toolbar-chat-input-container" />
            <TransitionAnimation type={ TransitionAnimationTypes.FADE_IN } inProp={ isMeExpanded } timeout={ 0 }>
                <ToolbarMeView useGuideTool={ useGuideTool } unseenAchievementCount={ getTotalUnseen } setMeExpanded={ setMeExpanded } />
            </TransitionAnimation>
            <div className="illumina-toolbar absolute bottom-0 left-0 z-10 flex h-[51px] w-full items-center justify-between">
                <div className="flex w-full items-center">
                    <div className="flex cursor-pointer items-center pr-[15px]" onClick={ event => setMeExpanded(!isMeExpanded) }>
                        <div className="relative h-[51px] w-[50px]">
                            <LayoutAvatarImageView figure={ userFigure } direction={ 2 } className="!absolute bottom-0 !h-[100px] w-full !bg-[left_-23px_top_12px]" />
                            { (getTotalUnseen > 0) && <LayoutItemCountView count={ getTotalUnseen } className="-right-2 -top-2" /> }
                        </div>
                        <div className="flex items-center gap-[9px]">
                            <p className="text-[13px] font-semibold text-white [text-shadow:_0_1px_0_#33312B]" dangerouslySetInnerHTML={{ __html: GetSessionDataManager().userName }} />
                            <i className="block h-[5px] w-[9px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-282px_-23px]" />
                        </div>
                    </div>
                    { (isInRoom && cameraEnabled) && <div onClick={ event => CreateLinkEvent("camera/toggle") }>
                        <i className="relative block h-[22px] w-7 cursor-pointer bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-226px_-49px] drop-shadow-[1px_1px_0_#46423E] hover:-translate-x-px hover:-translate-y-px hover:drop-shadow-[2px_2px_0_#46423E] active:translate-x-0 active:translate-y-0 active:brightness-90 active:drop-shadow-[1px_1px_0_#46423E]" />
                    </div> }
                    <div className="mx-[15px] h-[26px] w-0.5 border-r border-r-[#3E3931] bg-black" />
                    { toolbarType === "default" &&
                        <>
                            <div className="flex items-center gap-3">
                                { isInRoom
                                    ? <div onClick={ event => VisitDesktop() }>
                                        <i className="relative block size-7 cursor-pointer bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-0px_-49px] drop-shadow-[1px_1px_0_#46423E] hover:-translate-x-px hover:-translate-y-px hover:drop-shadow-[2px_2px_0_#46423E] active:translate-x-0 active:translate-y-0 active:brightness-90 active:drop-shadow-[1px_1px_0_#46423E]" />
                                    </div>
                                    : <div onClick={ event => CreateLinkEvent("navigator/goto/home") }>
                                        <i className="relative block h-[30px] w-8 cursor-pointer bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-29px_-49px] drop-shadow-[1px_1px_0_#46423E] hover:-translate-x-px hover:-translate-y-px hover:drop-shadow-[2px_2px_0_#46423E] active:translate-x-0 active:translate-y-0 active:brightness-90 active:drop-shadow-[1px_1px_0_#46423E]" />
                                    </div>
                                }
                                <div onClick={ event => CreateLinkEvent("navigator/toggle") }>
                                    <i className="relative block size-8 cursor-pointer bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-91px_-49px] drop-shadow-[1px_1px_0_#46423E] hover:-translate-x-px hover:-translate-y-px hover:drop-shadow-[2px_2px_0_#46423E] active:translate-x-0 active:translate-y-0 active:brightness-90 active:drop-shadow-[1px_1px_0_#46423E]" />
                                </div>
                                { gameCenterEnabled && <div onClick={ event => CreateLinkEvent("games/show") }>
                                    <i className="relative block w-[37px] h-6 cursor-pointer bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-156px_-288px] drop-shadow-[1px_1px_0_#46423E] hover:-translate-x-px hover:-translate-y-px hover:drop-shadow-[2px_2px_0_#46423E] active:translate-x-0 active:translate-y-0 active:brightness-90 active:drop-shadow-[1px_1px_0_#46423E]" />
                                </div> }
                                <div onClick={ event => CreateLinkEvent("catalog/toggle") }>
                                    <i className="relative block size-8 cursor-pointer bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-124px_-49px] drop-shadow-[1px_1px_0_#46423E] hover:-translate-x-px hover:-translate-y-px hover:drop-shadow-[2px_2px_0_#46423E] active:translate-x-0 active:translate-y-0 active:brightness-90 active:drop-shadow-[1px_1px_0_#46423E]" />
                                </div>
                                <div onClick={ event => CreateLinkEvent("inventory/toggle") }>
                                    <i className="relative block h-[29px] w-7 cursor-pointer bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-62px_-49px] drop-shadow-[1px_1px_0_#46423E] hover:-translate-x-px hover:-translate-y-px hover:drop-shadow-[2px_2px_0_#46423E] active:translate-x-0 active:translate-y-0 active:brightness-90 active:drop-shadow-[1px_1px_0_#46423E]">
                                        { (getFullCount > 0) && <LayoutItemCountView count={ getFullCount } /> }
                                    </i>
                                </div>
                                { (isMod && modToolsClosable) && <div onClick={ event => CreateLinkEvent("mod-tools/toggle") }>
                                    <i className="relative block size-[31px] cursor-pointer bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-158px_-49px] drop-shadow-[1px_1px_0_#46423E] hover:-translate-x-px hover:-translate-y-px hover:drop-shadow-[2px_2px_0_#46423E] active:translate-x-0 active:translate-y-0 active:brightness-90 active:drop-shadow-[1px_1px_0_#46423E]" />
                                </div> }
                            </div>
                            <div className="mx-[15px] h-[26px] w-0.5 border-r border-r-[#3E3931] bg-black" />
                        </> }
                    <div id="toolbar-friend-bar-container" className="flex h-[51px] w-full" />
                </div>
                <div className="mr-[15px] flex items-center">
                    <div className="mx-[15px] h-10 w-0.5 border-r border-r-[#3E3931] bg-black" />
                    <div className="flex items-center gap-3">
                        <i className="relative block h-[33px] w-[35px] cursor-pointer bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-190px_-49px] drop-shadow-[1px_1px_0_#46423E] hover:-translate-x-px hover:-translate-y-px hover:drop-shadow-[2px_2px_0_#46423E] active:translate-x-0 active:translate-y-0 active:brightness-90 active:drop-shadow-[1px_1px_0_#46423E]" onClick={ event => CreateLinkEvent("friends/toggle") }>
                            { (requests.length > 0) && <LayoutItemCountView count={ requests.length } /> }
                        </i>
                    </div>
                </div>
            </div>
        </>
    )
}
