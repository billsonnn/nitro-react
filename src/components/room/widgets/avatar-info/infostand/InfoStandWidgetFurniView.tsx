import { CrackableDataType, GroupInformationComposer, GroupInformationEvent, NowPlayingEvent, RoomControllerLevel, RoomObjectCategory, RoomObjectOperationType, RoomObjectVariable, RoomWidgetEnumItemExtradataParameter, RoomWidgetFurniInfoUsagePolicyEnum, SetObjectDataMessageComposer, SongInfoReceivedEvent, StringDataType } from "@nitrots/nitro-renderer"
import { FC, useCallback, useEffect, useState } from "react"
import { AvatarInfoFurni, CreateLinkEvent, GetConfiguration, GetGroupInformation, GetNitroInstance, GetRoomEngine, GetUserProfile, LocalizeText, SendMessageComposer } from "../../../../../api"
import { Button, LayoutBadgeImageView, LayoutLimitedEditionCompactPlateView, LayoutRarityLevelView } from "../../../../../common"
import { LayoutTimesView } from "../../../../../common/layout/LayoutTimesView"
import { useMessageEvent, useRoom, useSoundEvent } from "../../../../../hooks"

interface InfoStandWidgetFurniViewProps {
    avatarInfo: AvatarInfoFurni;
    onClose: () => void;
}

const PICKUP_MODE_NONE: number = 0
const PICKUP_MODE_EJECT: number = 1
const PICKUP_MODE_FULL: number = 2

export const InfoStandWidgetFurniView: FC<InfoStandWidgetFurniViewProps> = props => {
    const { avatarInfo = null, onClose = null } = props
    const { roomSession = null } = useRoom()

    const [ pickupMode, setPickupMode ] = useState(0)
    const [ canMove, setCanMove ] = useState(false)
    const [ canRotate, setCanRotate ] = useState(false)
    const [ canUse, setCanUse ] = useState(false)
    const [ furniKeys, setFurniKeys ] = useState<string[]>([])
    const [ furniValues, setFurniValues ] = useState<string[]>([])
    const [ customKeys, setCustomKeys ] = useState<string[]>([])
    const [ customValues, setCustomValues ] = useState<string[]>([])
    const [ isCrackable, setIsCrackable ] = useState(false)
    const [ crackableHits, setCrackableHits ] = useState(0)
    const [ crackableTarget, setCrackableTarget ] = useState(0)
    const [ godMode, setGodMode ] = useState(false)
    const [ canSeeFurniId, setCanSeeFurniId ] = useState(false)
    const [ groupName, setGroupName ] = useState<string>(null)
    const [ isJukeBox, setIsJukeBox ] = useState<boolean>(false)
    const [ isSongDisk, setIsSongDisk ] = useState<boolean>(false)
    const [ songId, setSongId ] = useState<number>(-1)
    const [ songName, setSongName ] = useState<string>("")
    const [ songCreator, setSongCreator ] = useState<string>("")

    useSoundEvent<NowPlayingEvent>(NowPlayingEvent.NPE_SONG_CHANGED, event => {
        setSongId(event.id)
    }, (isJukeBox || isSongDisk))

    useSoundEvent<NowPlayingEvent>(SongInfoReceivedEvent.SIR_TRAX_SONG_INFO_RECEIVED, event => {
        if (event.id !== songId) return

        const songInfo = GetNitroInstance().soundManager.musicController.getSongInfo(event.id)

        if (!songInfo) return

        setSongName(songInfo.name)
        setSongCreator(songInfo.creator)
    }, (isJukeBox || isSongDisk))

    useEffect(() => {
        let pickupMode = PICKUP_MODE_NONE
        let canMove = false
        let canRotate = false
        let canUse = false
        let furniKeyss: string[] = []
        let furniValuess: string[] = []
        let customKeyss: string[] = []
        let customValuess: string[] = []
        let isCrackable = false
        let crackableHits = 0
        let crackableTarget = 0
        let godMode = false
        let canSeeFurniId = false
        let furniIsJukebox = false
        let furniIsSongDisk = false
        let furniSongId = -1

        const isValidController = (avatarInfo.roomControllerLevel >= RoomControllerLevel.GUEST)

        if (isValidController || avatarInfo.isOwner || avatarInfo.isRoomOwner || avatarInfo.isAnyRoomController) {
            canMove = true
            canRotate = !avatarInfo.isWallItem

            if (avatarInfo.roomControllerLevel >= RoomControllerLevel.MODERATOR) godMode = true
        }

        if (avatarInfo.isAnyRoomController) {
            canSeeFurniId = true
        }

        if ((((avatarInfo.usagePolicy === RoomWidgetFurniInfoUsagePolicyEnum.EVERYBODY) || ((avatarInfo.usagePolicy === RoomWidgetFurniInfoUsagePolicyEnum.CONTROLLER) && isValidController)) || ((avatarInfo.extraParam === RoomWidgetEnumItemExtradataParameter.JUKEBOX) && isValidController)) || ((avatarInfo.extraParam === RoomWidgetEnumItemExtradataParameter.USABLE_PRODUCT) && isValidController)) canUse = true

        if (avatarInfo.extraParam) {
            if (avatarInfo.extraParam === RoomWidgetEnumItemExtradataParameter.CRACKABLE_FURNI) {
                const stuffData = (avatarInfo.stuffData as CrackableDataType)

                canUse = true
                isCrackable = true
                crackableHits = stuffData.hits
                crackableTarget = stuffData.target
            }

            else if (avatarInfo.extraParam === RoomWidgetEnumItemExtradataParameter.JUKEBOX) {
                const playlist = GetNitroInstance().soundManager.musicController.getRoomItemPlaylist()

                if (playlist) {
                    furniSongId = playlist.nowPlayingSongId
                }

                furniIsJukebox = true
            }

            else if (avatarInfo.extraParam.indexOf(RoomWidgetEnumItemExtradataParameter.SONGDISK) === 0) {
                furniSongId = parseInt(avatarInfo.extraParam.substr(RoomWidgetEnumItemExtradataParameter.SONGDISK.length))

                furniIsSongDisk = true
            }

            if (godMode) {
                const extraParam = avatarInfo.extraParam.substr(RoomWidgetEnumItemExtradataParameter.BRANDING_OPTIONS.length)

                if (extraParam) {
                    const parts = extraParam.split("\t")

                    for (const part of parts) {
                        const value = part.split("=")

                        if (value && (value.length === 2)) {
                            furniKeyss.push(value[0])
                            furniValuess.push(value[1])
                        }
                    }
                }
            }
        }

        if (godMode) {
            const roomObject = GetRoomEngine().getRoomObject(roomSession.roomId, avatarInfo.id, (avatarInfo.isWallItem) ? RoomObjectCategory.WALL : RoomObjectCategory.FLOOR)

            if (roomObject) {
                const customVariables = roomObject.model.getValue<string[]>(RoomObjectVariable.FURNITURE_CUSTOM_VARIABLES)
                const furnitureData = roomObject.model.getValue<{ [index: string]: string }>(RoomObjectVariable.FURNITURE_DATA)

                if (customVariables && customVariables.length) {
                    for (const customVariable of customVariables) {
                        customKeyss.push(customVariable)
                        customValuess.push((furnitureData[customVariable]) || "")
                    }
                }
            }
        }

        if (avatarInfo.isOwner || avatarInfo.isAnyRoomController) pickupMode = PICKUP_MODE_FULL

        else if (avatarInfo.isRoomOwner || (avatarInfo.roomControllerLevel >= RoomControllerLevel.GUILD_ADMIN)) pickupMode = PICKUP_MODE_EJECT

        if (avatarInfo.isStickie) pickupMode = PICKUP_MODE_NONE

        setPickupMode(pickupMode)
        setCanMove(canMove)
        setCanRotate(canRotate)
        setCanUse(canUse)
        setFurniKeys(furniKeyss)
        setFurniValues(furniValuess)
        setCustomKeys(customKeyss)
        setCustomValues(customValuess)
        setIsCrackable(isCrackable)
        setCrackableHits(crackableHits)
        setCrackableTarget(crackableTarget)
        setGodMode(godMode)
        setCanSeeFurniId(canSeeFurniId)
        setGroupName(null)
        setIsJukeBox(furniIsJukebox)
        setIsSongDisk(furniIsSongDisk)
        setSongId(furniSongId)

        if (avatarInfo.groupId) SendMessageComposer(new GroupInformationComposer(avatarInfo.groupId, false))
    }, [ roomSession, avatarInfo ])

    useMessageEvent<GroupInformationEvent>(GroupInformationEvent, event => {
        const parser = event.getParser()

        if (!avatarInfo || avatarInfo.groupId !== parser.id || parser.flag) return

        if (groupName) setGroupName(null)

        setGroupName(parser.title)
    })

    useEffect(() => {
        const songInfo = GetNitroInstance().soundManager.musicController.getSongInfo(songId)

        setSongName(songInfo?.name ?? "")
        setSongCreator(songInfo?.creator ?? "")
    }, [ songId ])

    const onFurniSettingChange = useCallback((index: number, value: string) => {
        const clone = Array.from(furniValues)

        clone[index] = value

        setFurniValues(clone)
    }, [ furniValues ])

    const onCustomVariableChange = useCallback((index: number, value: string) => {
        const clone = Array.from(customValues)

        clone[index] = value

        setCustomValues(clone)
    }, [ customValues ])

    const getFurniSettingsAsString = useCallback(() => {
        if (furniKeys.length === 0 || furniValues.length === 0) return ""

        let data = ""

        let i = 0

        while (i < furniKeys.length) {
            const key = furniKeys[i]
            const value = furniValues[i]

            data = (data + (key + "=" + value + "\t"))

            i++
        }

        return data
    }, [ furniKeys, furniValues ])

    const processButtonAction = useCallback((action: string) => {
        if (!action || (action === "")) return

        let objectData: string = null

        switch (action) {
        case "buy_one":
            CreateLinkEvent(`catalog/open/offerId/${avatarInfo.purchaseOfferId}`)
            return
        case "move":
            GetRoomEngine().processRoomObjectOperation(avatarInfo.id, avatarInfo.category, RoomObjectOperationType.OBJECT_MOVE)
            break
        case "rotate":
            GetRoomEngine().processRoomObjectOperation(avatarInfo.id, avatarInfo.category, RoomObjectOperationType.OBJECT_ROTATE_POSITIVE)
            break
        case "pickup":
            if (pickupMode === PICKUP_MODE_FULL) {
                GetRoomEngine().processRoomObjectOperation(avatarInfo.id, avatarInfo.category, RoomObjectOperationType.OBJECT_PICKUP)
            }
            else {
                GetRoomEngine().processRoomObjectOperation(avatarInfo.id, avatarInfo.category, RoomObjectOperationType.OBJECT_EJECT)
            }
            break
        case "use":
            GetRoomEngine().useRoomObject(avatarInfo.id, avatarInfo.category)
            break
        case "save_branding_configuration": {
            const mapData = new Map<string, string>()
            const dataParts = getFurniSettingsAsString().split("\t")

            if (dataParts) {
                for (const part of dataParts) {
                    const [ key, value ] = part.split("=", 2)

                    mapData.set(key, value)
                }
            }

            GetRoomEngine().modifyRoomObjectDataWithMap(avatarInfo.id, avatarInfo.category, RoomObjectOperationType.OBJECT_SAVE_STUFF_DATA, mapData)
            break
        }
        case "save_custom_variables": {
            const map = new Map()

            for (let i = 0; i < customKeys.length; i++) {
                const key = customKeys[i]
                const value = customValues[i]

                if ((key && key.length) && (value && value.length)) map.set(key, value)
            }

            SendMessageComposer(new SetObjectDataMessageComposer(avatarInfo.id, map))
            break
        }
        }
    }, [ avatarInfo, pickupMode, customKeys, customValues, getFurniSettingsAsString ])

    const getGroupBadgeCode = useCallback(() => {
        const stringDataType = (avatarInfo.stuffData as StringDataType)

        if (!stringDataType || !(stringDataType instanceof StringDataType)) return null

        return stringDataType.getValue(2)
    }, [ avatarInfo ])

    if (!avatarInfo) return null

    return (
        <div className="relative flex flex-col items-end">
            <div className="illumina-card relative w-[206px] px-2.5 pb-3.5 pt-1.5">
                <div className="flex justify-between">
                    <p className="w-10/12 text-[13px] font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{avatarInfo.name}</p>
                    <LayoutTimesView onClick={onClose} />
                </div>
                <div className="mb-[7px] mt-[3px] h-0.5 w-full border-b border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
                <div className="relative flex items-center">
                    {avatarInfo.stuffData.isUnique && <LayoutLimitedEditionCompactPlateView className="absolute right-0 top-0" uniqueNumber={avatarInfo.stuffData.uniqueNumber} uniqueSeries={avatarInfo.stuffData.uniqueSeries} />}
                    {avatarInfo.stuffData.rarityLevel > -1 && <LayoutRarityLevelView className="absolute right-0" level={avatarInfo.stuffData.rarityLevel} />}
                    {avatarInfo.image && avatarInfo.image.src.length && <img className="mx-auto block" src={avatarInfo.image.src} alt="" />}
                </div>
                <div className="mb-[7px] mt-2.5 h-0.5 w-full border-b border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
                {GetConfiguration("badge.descriptions.enabled", true) && (
                    <p className="px-[2px] text-[13px]">{avatarInfo.description}</p>
                )}
                <div className="mb-[7px] mt-2.5 h-0.5 w-full border-b border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
                <div className="group mb-[9px] flex cursor-pointer items-center gap-1" onClick={event => GetUserProfile(avatarInfo.ownerId)}>
                    <i className="mt-px block h-3 w-4 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-436px_0px]" />
                    <p className="text-[13px] !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">
                        {avatarInfo.ownerName}
                    </p>
                </div>
                {avatarInfo.groupId > 0 && <>
                    <div className="my-[7px] h-0.5 w-full border-b border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
                    <div className="mb-1.5 flex cursor-pointer items-center gap-2" onClick={() => GetGroupInformation(avatarInfo.groupId)}>
                        <LayoutBadgeImageView badgeCode={getGroupBadgeCode()} isGroup={true} />
                        <p className="text-[13px] !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{groupName}</p>
                    </div>
                </>}
                {(isJukeBox || isSongDisk) && <>
                    <div className="my-[7px] h-0.5 w-full border-b border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
                    <div className="mb-1.5 flex flex-col gap-[7px]">
                        <p className="text-[13px] !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">
                            {(songId === -1)
                                ? LocalizeText("infostand.jukebox.text.not.playing")
                                : LocalizeText("infostand.jukebox.text.now.playing")}
                        </p>
                        <div className="flex items-center gap-2">
                            <i className="size-3.5 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-303px_-38px]" />
                            <p className="text-[13px] !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">
                                {songName}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <i className="mx-0.5 h-[11px] w-2.5 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-292px_-38px]" />
                            <p className="text-[13px] !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">
                                {songCreator}
                            </p>
                        </div>
                    </div>
                </>}
                {(furniKeys.length > 0) && <>
                    <div className="my-[7px] h-0.5 w-full border-b border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
                    <div className="w-full">
                        {furniKeys.map((key, index) => (
                            <div key={index} className="mb-0.5 flex items-center justify-between">
                                <p className="text-[13px] !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{key}</p>
                                <div className="illumina-input relative h-[22px] w-[130px]">
                                    <input type="text" className="size-full bg-transparent pl-[9px] pr-[25px] text-[13px]" value={furniValues[index]} onChange={event => onFurniSettingChange(index, event.target.value)} />
                                </div>
                            </div>
                        ))}
                    </div>
                </>}
                {(avatarInfo.purchaseOfferId > 0) && <Button variant="volter" className="w-fit !px-2.5" onClick={event => processButtonAction("buy_one")}>{LocalizeText("infostand.button.buy")}</Button>}
                {isCrackable && <>
                    <div className="my-[7px] h-0.5 w-full border-b border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
                    <p className="text-[13px] !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{LocalizeText("infostand.crackable_furni.hits_remaining", [ "hits", "target" ], [ crackableHits.toString(), crackableTarget.toString() ])}</p>
                </>}
                {canSeeFurniId && <>
                    <div className="my-[7px] h-0.5 w-full border-b border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
                    <p className="text-[13px] !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">ID: {avatarInfo.id}</p>
                </>}
            </div>
            <div className="mt-1 flex items-center justify-end gap-1">
                {canMove &&
                    <Button variant="primary" className="!px-2" onClick={event => processButtonAction("move")}>
                        {LocalizeText("infostand.button.move")}
                    </Button>}
                {canRotate &&
                    <Button variant="primary" className="!px-2" onClick={event => processButtonAction("rotate")}>
                        {LocalizeText("infostand.button.rotate")}
                    </Button>}
                {(pickupMode !== PICKUP_MODE_NONE) &&
                    <Button variant="primary" className="!px-2" onClick={event => processButtonAction("pickup")}>
                        {LocalizeText((pickupMode === PICKUP_MODE_EJECT) ? "infostand.button.eject" : "infostand.button.pickup")}
                    </Button>}
                {canUse &&
                    <Button variant="primary" className="!px-2" onClick={event => processButtonAction("use")}>
                        {LocalizeText("infostand.button.use")}
                    </Button>}
                {((furniKeys.length > 0 && furniValues.length > 0) && (furniKeys.length === furniValues.length)) &&
                    <Button variant="primary" className="!px-2" onClick={() => processButtonAction("save_branding_configuration")}>
                        {LocalizeText("save")}
                    </Button>}
                {((customKeys.length > 0 && customValues.length > 0) && (customKeys.length === customValues.length)) &&
                    <Button variant="primary" className="!px-2" onClick={() => processButtonAction("save_custom_variables")}>
                        {LocalizeText("save")}
                    </Button>}
            </div>
        </div>
    )
}
