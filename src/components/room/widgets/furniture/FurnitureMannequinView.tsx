import { HabboClubLevelEnum, RoomControllerLevel } from "@nitrots/nitro-renderer"
import { FC, useEffect, useState } from "react"
import { CreateLinkEvent, GetAvatarRenderManager, GetClubMemberLevel, GetRoomSession, GetSessionDataManager, LocalizeText, MannequinUtilities } from "../../../../api"
import { Button, LayoutAvatarImageView, NitroCardContentView, NitroCardHeaderView, NitroCardView } from "../../../../common"
import { useFurnitureMannequinWidget } from "../../../../hooks"

const MODE_NONE: number = -1
const MODE_CONTROLLER: number = 0
const MODE_UPDATE: number = 1
const MODE_PEER: number = 2
const MODE_NO_CLUB: number = 3
const MODE_WRONG_GENDER: number = 4

export const FurnitureMannequinView: FC<{}> = props =>
{
    const [ renderedFigure, setRenderedFigure ] = useState<string>(null)
    const [ mode, setMode ] = useState(MODE_NONE)
    const { objectId = -1, figure = null, gender = null, clubLevel = HabboClubLevelEnum.NO_CLUB, name = null, setName = null, saveFigure = null, wearFigure = null, saveName = null, onClose = null } = useFurnitureMannequinWidget()

    useEffect(() =>
    {
        if(objectId === -1) return

        const roomSession = GetRoomSession()

        if(roomSession.isRoomOwner || (roomSession.controllerLevel >= RoomControllerLevel.GUEST) || GetSessionDataManager().isModerator)
        {
            setMode(MODE_CONTROLLER)

            return
        }
        
        if(GetSessionDataManager().gender.toLowerCase() !== gender.toLowerCase())
        {
            setMode(MODE_WRONG_GENDER)

            return
        }

        if(GetClubMemberLevel() < clubLevel)
        {
            setMode(MODE_NO_CLUB)

            return
        }
        
        setMode(MODE_PEER)
    }, [ objectId, gender, clubLevel ])

    useEffect(() =>
    {
        switch(mode)
        {
        case MODE_CONTROLLER:
        case MODE_WRONG_GENDER: {
            const figureContainer = GetAvatarRenderManager().createFigureContainer(figure)

            MannequinUtilities.transformAsMannequinFigure(figureContainer)

            setRenderedFigure(figureContainer.getFigureString())
            break
        }
        case MODE_UPDATE: {
            const figureContainer = GetAvatarRenderManager().createFigureContainer(GetSessionDataManager().figure)

            MannequinUtilities.transformAsMannequinFigure(figureContainer)

            setRenderedFigure(figureContainer.getFigureString())
            break
        }
        case MODE_PEER:
        case MODE_NO_CLUB: {
            const figureContainer = MannequinUtilities.getMergedMannequinFigureContainer(GetSessionDataManager().figure, figure)

            setRenderedFigure(figureContainer.getFigureString())
            break
        }
        }
    }, [ mode, figure, clubLevel ])

    if(objectId === -1) return null

    return (
        <NitroCardView uniqueKey="furniture-mannequin" className="illumina-furniture-mannequin w-[388px]">
            <NitroCardHeaderView headerText={ LocalizeText("mannequin.widget.title") } onCloseClick={ onClose } />
            <NitroCardContentView>
                <div className="flex">
                    <div className="relative h-[130px] w-[83px] shrink-0 bg-[url('/client-assets/images/room-widgets/mannequin/spritesheet.png?v=2451779')]">
                        <LayoutAvatarImageView className="absolute !bg-[-5px_-14px]" figure={ renderedFigure } direction={ 2 } />
                        { (clubLevel > 0) && <i className="absolute bottom-3.5 right-[7px] block h-[19px] w-[15px] bg-[url('/client-assets/images/room-widgets/mannequin/spritesheet.png?v=2451779')] bg-[-83px_0px]" /> }
                    </div>
                    <div className="flex w-full flex-col px-[30px] pt-[15px]">
                        { (mode === MODE_CONTROLLER) &&
                            <>
                                <div className="illumina-input relative mb-[11px] h-[26px] w-full">
                                    <input type="text" className="size-full bg-transparent pl-[9px] pr-[25px] text-[13px] text-black placeholder:italic" placeholder={ LocalizeText("mannequin.widget.set_name_hint") } value={ name } onChange={ event => setName(event.target.value) } onBlur={ saveName } />
                                    <i className="absolute right-[3px] top-[3px] h-[18px] w-[17px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-335px_0px] bg-no-repeat" />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <Button className="w-full" onClick={ event => setMode(MODE_UPDATE) }>
                                        { LocalizeText("mannequin.widget.style") }
                                    </Button>
                                    <Button className="w-full" onClick={ wearFigure }>
                                        { LocalizeText("mannequin.widget.wear") }
                                    </Button>
                                </div>
                            </> }
                        { (mode === MODE_UPDATE) &&
                            <>
                                <div className="h-8">
                                    <p className="font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ name }</p>
                                </div>
                                <p className="text-sm">{ LocalizeText("mannequin.widget.savetext") }</p>
                            </> }
                        { (mode === MODE_PEER) &&
                            <>
                                <div className="h-8">
                                    <p className="font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ name }</p>
                                </div>
                                <p className="text-sm">{ LocalizeText("mannequin.widget.weartext") }</p>
                            </> }
                        { (mode === MODE_NO_CLUB) &&
                        <>
                            <div className="h-8" />
                            <p className="text-sm">{ LocalizeText("mannequin.widget.clubnotification") }</p>
                        </> }
                        { (mode === MODE_WRONG_GENDER) &&
                            <>
                                <div className="h-8" />
                                <p className="text-sm">{ LocalizeText("mannequin.widget.wronggender") }</p>
                            </> }
                    </div>
                </div>
                { (mode === MODE_UPDATE) &&
                    <div className="mt-px flex items-center justify-between">
                        <Button variant="underline" onClick={ event => setMode(MODE_CONTROLLER) }>
                            { LocalizeText("mannequin.widget.back") }
                        </Button>
                        <Button className="!h-[29px] !px-8" onClick={ saveFigure }>
                            { LocalizeText("mannequin.widget.save") }
                        </Button>
                    </div> }
                { (mode === MODE_PEER) &&
                    <div className="mt-px flex items-center justify-end">
                        <Button className="!h-[29px] !px-8" onClick={ wearFigure }>
                            { LocalizeText("mannequin.widget.wear") }
                        </Button>
                    </div> }
                { (mode === MODE_NO_CLUB) &&
                    <div className="mt-px flex items-center justify-end">
                        <Button className="!h-[29px] !px-8" onClick={ () => CreateLinkEvent("habboUI/open/hccenter") }>
                            { LocalizeText("mannequin.widget.getclub") }
                        </Button>
                    </div> }
                { (mode === MODE_WRONG_GENDER) &&
                    <div className="mt-px flex items-center justify-end">
                        <Button className="!h-[29px] !px-8" onClick={ onClose }>
                            { LocalizeText("generic.ok") }
                        </Button>
                    </div> }
            </NitroCardContentView>
        </NitroCardView>
    )
}
