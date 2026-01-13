import { RelationshipStatusInfoEvent, RelationshipStatusInfoMessageParser, RoomSessionFavoriteGroupUpdateEvent, RoomSessionUserBadgesEvent, RoomSessionUserFigureUpdateEvent, UserRelationshipsComposer } from "@nitrots/nitro-renderer"
import { Dispatch, FC, FocusEvent, KeyboardEvent, SetStateAction, useEffect, useState } from "react"
import { AvatarInfoUser, CloneObject, GetConfiguration, GetGroupInformation, GetSessionDataManager, GetUserProfile, LocalizeText, SendMessageComposer } from "../../../../../api"
import { LayoutAvatarImageView, LayoutBadgeImageView } from "../../../../../common"
import { LayoutTimesView } from "../../../../../common/layout/LayoutTimesView"
import { useMessageEvent, useRoom, useRoomSessionManagerEvent } from "../../../../../hooks"
import { InfoStandWidgetUserRelationshipsView } from "./InfoStandWidgetUserRelationshipsView"
import { InfoStandWidgetUserTagsView } from "./InfoStandWidgetUserTagsView"

interface InfoStandWidgetUserViewProps
{
    avatarInfo: AvatarInfoUser;
    setAvatarInfo: Dispatch<SetStateAction<AvatarInfoUser>>;
    onClose: () => void;
}

export const InfoStandWidgetUserView: FC<InfoStandWidgetUserViewProps> = props =>
{
    const { avatarInfo = null, setAvatarInfo = null, onClose = null } = props
    const [ motto, setMotto ] = useState<string>(null)
    const [ isEditingMotto, setIsEditingMotto ] = useState(false)
    const [ relationships, setRelationships ] = useState<RelationshipStatusInfoMessageParser>(null)
    const { roomSession = null } = useRoom()

    const saveMotto = (motto: string) =>
    {
        if(!isEditingMotto || (motto.length > GetConfiguration<number>("motto.max.length", 38))) return

        roomSession.sendMottoMessage(motto)

        setIsEditingMotto(false)
    }

    const onMottoBlur = (event: FocusEvent<HTMLTextAreaElement>) => saveMotto(event.target.value)

    const onMottoKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) =>
    {
        event.stopPropagation()

        switch(event.key)
        {
        case "Enter":
            saveMotto((event.target as HTMLInputElement).value)
            return
        }
    }

    useRoomSessionManagerEvent<RoomSessionUserBadgesEvent>(RoomSessionUserBadgesEvent.RSUBE_BADGES, event =>
    {
        if(!avatarInfo || (avatarInfo.webID !== event.userId)) return

        const oldBadges = avatarInfo.badges.join("")

        if(oldBadges === event.badges.join("")) return

        setAvatarInfo(prevValue =>
        {
            const newValue = CloneObject(prevValue)

            newValue.badges = event.badges

            return newValue
        })
    })

    useRoomSessionManagerEvent<RoomSessionUserFigureUpdateEvent>(RoomSessionUserFigureUpdateEvent.USER_FIGURE, event =>
    {
        if(!avatarInfo || (avatarInfo.roomIndex !== event.roomIndex)) return

        setAvatarInfo(prevValue =>
        {
            const newValue = CloneObject(prevValue)

            newValue.figure = event.figure
            newValue.motto = event.customInfo
            newValue.achievementScore = event.activityPoints

            return newValue
        })
    })

    useRoomSessionManagerEvent<RoomSessionFavoriteGroupUpdateEvent>(RoomSessionFavoriteGroupUpdateEvent.FAVOURITE_GROUP_UPDATE, event =>
    {
        if(!avatarInfo || (avatarInfo.roomIndex !== event.roomIndex)) return

        setAvatarInfo(prevValue =>
        {
            const newValue = CloneObject(prevValue)
            const clearGroup = ((event.status === -1) || (event.habboGroupId <= 0))

            newValue.groupId = clearGroup ? -1 : event.habboGroupId
            newValue.groupName = clearGroup ? null : event.habboGroupName
            newValue.groupBadgeId = clearGroup ? null : GetSessionDataManager().getGroupBadge(event.habboGroupId)

            return newValue
        })
    })

    useMessageEvent<RelationshipStatusInfoEvent>(RelationshipStatusInfoEvent, event =>
    {
        const parser = event.getParser()

        if(!avatarInfo || (avatarInfo.webID !== parser.userId)) return

        setRelationships(parser)
    })

    useEffect(() =>
    {
        setIsEditingMotto(false)
        setMotto(avatarInfo.motto)

        SendMessageComposer(new UserRelationshipsComposer(avatarInfo.webID))

        return () =>
        {
            setIsEditingMotto(false)
            setMotto(null)
            setRelationships(null)
        }
    }, [ avatarInfo ])

    if(!avatarInfo) return null

    return (
        <div className="illumina-card relative w-[206px] px-2.5 pb-3.5 pt-1.5">
            <div className="flex items-end justify-between">
                <p className="text-[13px] font-semibold !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ avatarInfo.name }</p>
                <div className="flex gap-1">
                    <button className="illumina-btn-primary px-[7px] py-1" onClick={ event => GetUserProfile(avatarInfo.webID) }>
                        <i className="block h-3 w-4 cursor-pointer bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-436px_0px]" />
                    </button>
                    <LayoutTimesView onClick={ onClose } />
                </div>
            </div>
            <div className="mb-[7px] mt-[3px] h-0.5 w-full border-b border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
            <div className="flex gap-[9px]">
                <div className="illumina-previewer flex w-[74px] cursor-pointer items-center justify-center" onClick={ event => GetUserProfile(avatarInfo.webID) }>
                    <LayoutAvatarImageView figure={ avatarInfo.figure } direction={ 2 } />
                </div>
                <div className="flex flex-wrap gap-[7px]">
                    <div className="illumina-card-item badge-image relative flex size-12 cursor-pointer items-center justify-center bg-center bg-no-repeat">
                        { avatarInfo.badges[0] && <LayoutBadgeImageView badgeCode={ avatarInfo.badges[0] } showInfo={ true } /> }
                    </div>
                    <div className={`illumina-card-item relative flex size-12 items-center justify-center bg-center bg-no-repeat ${avatarInfo.groupId > 0 ? "cursor-pointer" : ""} badge-image`} onClick={ event => GetGroupInformation(avatarInfo.groupId) }>
                        { avatarInfo.groupId > 0 && <LayoutBadgeImageView badgeCode={ avatarInfo.groupBadgeId } isGroup={ true } showInfo={ true } customTitle={ avatarInfo.groupName } /> }
                    </div>
                    <div className="illumina-card-item badge-image relative flex size-12 cursor-pointer items-center justify-center bg-center bg-no-repeat">
                        { avatarInfo.badges[1] && <LayoutBadgeImageView badgeCode={ avatarInfo.badges[1] } showInfo={ true } /> }
                    </div>
                    <div className="illumina-card-item badge-image relative flex size-12 cursor-pointer items-center justify-center bg-center bg-no-repeat">
                        { avatarInfo.badges[2] && <LayoutBadgeImageView badgeCode={ avatarInfo.badges[2] } showInfo={ true } /> }
                    </div>
                    <div className="illumina-card-item badge-image relative flex size-12 cursor-pointer items-center justify-center bg-center bg-no-repeat">
                        { avatarInfo.badges[3] && <LayoutBadgeImageView badgeCode={ avatarInfo.badges[3] } showInfo={ true } /> }
                    </div>
                    <div className="illumina-card-item badge-image relative flex size-12 cursor-pointer items-center justify-center bg-center bg-no-repeat">
                        { avatarInfo.badges[4] && <LayoutBadgeImageView badgeCode={ avatarInfo.badges[4] } showInfo={ true } /> }
                    </div>
                </div>
            </div>
            <div className="my-1 h-0.5 w-full border-b border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
            <div className="illumina-card-item h-8 w-full px-1.5">
                <div className="flex h-full items-center gap-2">
                    <i className="size-[17px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-335px_0px]" />
                    { !isEditingMotto &&
                        <p className="size-full overflow-hidden break-words py-1 text-sm !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]" onClick={ event => avatarInfo.type === AvatarInfoUser.OWN_USER && setIsEditingMotto(true) }>{ motto }</p> }
                    { isEditingMotto &&
                        <textarea className="size-full bg-transparent py-1 text-sm italic !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]" spellCheck={ false } maxLength={ GetConfiguration<number>("motto.max.length", 38) } onChange={ event => setMotto(event.target.value) } onBlur={ onMottoBlur } onKeyDown={ onMottoKeyDown } >{ motto }</textarea>}
                </div>
            </div>
            <div className="mb-[7px] mt-1 h-0.5 w-full border-b border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
            <p className="text-sm [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">
                <b className="font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("infostand.text.achievement_score") }</b>
                { " " + avatarInfo.achievementScore }
            </p>
            { (avatarInfo.carryItem > 0) &&
                <>
                    <div className="my-1 h-0.5 w-full border-b border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
                    <p className="text-sm [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">
                        { LocalizeText("infostand.text.handitem", [ "item" ], [ LocalizeText("handitem" + avatarInfo.carryItem) ]) }
                    </p>
                </> }
            <div className="mt-[7px] h-[52px]">
                <InfoStandWidgetUserRelationshipsView relationships={ relationships } />
            </div>
            { GetConfiguration("user.tags.enabled") &&
                <InfoStandWidgetUserTagsView tags={ GetSessionDataManager().tags } /> }
        </div>
    )
}
