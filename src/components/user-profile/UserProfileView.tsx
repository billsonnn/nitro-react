import { ExtendedProfileChangedMessageEvent, FriendlyTime, RelationshipStatusInfoEvent, RelationshipStatusInfoMessageParser, RoomEngineObjectEvent, RoomObjectCategory, RoomObjectType, UserCurrentBadgesComposer, UserCurrentBadgesEvent, UserProfileEvent, UserProfileParser, UserRelationshipsComposer } from "@nitrots/nitro-renderer"
import { FC, useState } from "react"
import { CreateLinkEvent, GetRoomSession, GetSessionDataManager, GetUserProfile, LocalizeText, OpenMessengerChat, ReportType, SendMessageComposer } from "../../api"
import { Button, LayoutAvatarImageView, NitroBigCardContentView, NitroBigCardHeaderView, NitroBigCardView } from "../../common"
import { useFriends, useHelp, useMessageEvent, useRoomEngineEvent } from "../../hooks"
import { BadgesContainerView } from "./views/BadgesContainerView"
import { GroupsContainerView } from "./views/GroupsContainerView"
import { RelationshipsContainerView } from "./views/RelationshipsContainerView"
import { RoomsContainerView } from "./views/RoomsContainerView"

export const UserProfileView: FC<{}> = props =>
{
    const [ userProfile, setUserProfile ] = useState<UserProfileParser>(null)
    const [ userBadges, setUserBadges ] = useState<string[]>([])
    const [ userRelationships, setUserRelationships ] = useState<RelationshipStatusInfoMessageParser>(null)
    const { canRequestFriend = null, getFriend = null } = useFriends()
    const { report = null } = useHelp()

    const onClose = () =>
    {
        setUserProfile(null)
        setUserBadges([])
        setUserRelationships(null)
    }

    const processAction = (name: string) =>
    {
        let hideMenu = true

        if(name)
        {
            switch(name)
            {
            case "message":
                OpenMessengerChat(userProfile.id)
                break
            case "friend":
                CreateLinkEvent(`friends/request/${ userProfile.id }/${ userProfile.username }`)
                return
            case "report":
                report(ReportType.BULLY, { reportedUserId: userProfile.id })
                break
            }
        }

        if(hideMenu) onClose()
    }

    useMessageEvent<UserCurrentBadgesEvent>(UserCurrentBadgesEvent, event =>
    {
        const parser = event.getParser()

        if(!userProfile || (parser.userId !== userProfile.id)) return

        setUserBadges(parser.badges)
    })

    useMessageEvent<RelationshipStatusInfoEvent>(RelationshipStatusInfoEvent, event =>
    {
        const parser = event.getParser()

        if(!userProfile || (parser.userId !== userProfile.id)) return

        setUserRelationships(parser)
    })

    useMessageEvent<UserProfileEvent>(UserProfileEvent, event =>
    {
        const parser = event.getParser()

        let isSameProfile = false

        setUserProfile(prevValue =>
        {
            if(prevValue && prevValue.id) isSameProfile = (prevValue.id === parser.id)

            return parser
        })

        if(!isSameProfile)
        {
            setUserBadges([])
            setUserRelationships(null)
        }

        SendMessageComposer(new UserCurrentBadgesComposer(parser.id))
        SendMessageComposer(new UserRelationshipsComposer(parser.id))
    })

    useMessageEvent<ExtendedProfileChangedMessageEvent>(ExtendedProfileChangedMessageEvent, event =>
    {
        const parser = event.getParser()

        if(parser.userId !== userProfile?.id) return

        GetUserProfile(parser.userId)
    })

    useRoomEngineEvent<RoomEngineObjectEvent>(RoomEngineObjectEvent.SELECTED, event =>
    {
        if(!userProfile) return

        if(event.category !== RoomObjectCategory.UNIT) return

        const userData = GetRoomSession().userDataManager.getUserDataByIndex(event.objectId)

        if(userData.type !== RoomObjectType.USER) return

        GetUserProfile(userData.webID)
    })

    if(!userProfile) return null

    return (
        <NitroBigCardView uniqueKey="profile" className="illumina-profile mt-[110px] w-[560px]" onCloseClick={ onClose }>
            <NitroBigCardHeaderView className="absolute top-[-100px] mb-0 ml-2.5 w-full">
                <div className="relative flex w-full items-end justify-between">
                    <div>
                        { userProfile.motto.length > 0 &&
                            <div className="illumina-profile-motto absolute left-[19px] top-[-25px] min-w-[150px] px-3 py-[9px]">
                                <p className="break-all text-[11px] font-semibold !leading-3 !text-black [text-shadow:_0_1px_0_#fff]">{ userProfile.motto }</p>
                                <div className="caret-down" />
                            </div> }
                        <div className="flex items-center">
                            <LayoutAvatarImageView className="!h-[115px] !w-[49px] !bg-[-25px_-10px]" figure={ userProfile.figure } direction={ 2 } />
                            <div className="flex flex-col">
                                <p className="mb-[5px] text-[11px] font-semibold uppercase !leading-3 text-white [text-shadow:_0_1px_0_#33312B]">{ LocalizeText("profile.username.title") }</p>
                                <span className="text-3xl font-semibold !leading-6 text-white [text-shadow:_0_1px_0_#33312B]">{ userProfile.username }</span>
                            </div>
                        </div>
                    </div>
                    <p className="mb-5 mr-[25px] text-xs font-semibold text-white [text-shadow:_0_1px_0_#33312B]">{ LocalizeText("profile.created_at.text", [ "date" ], [ userProfile.registration ]) }</p>
                </div>
            </NitroBigCardHeaderView>
            <NitroBigCardContentView className="!p-0 !pt-[5px]">
                <div className="px-2">
                    <div className="flex items-center justify-between pb-0.5 pl-[52px] pt-1">
                        <div className="w-full">
                            <p className="!dark:text-[#cccccc] text-xs font-semibold !leading-3 text-[#1B1B1B]  [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">
                                { userProfile.isOnline
                                    ? LocalizeText("profile.online.text", [ "username" ], [ userProfile.username ])
                                    : LocalizeText("profile.offline.text", [ "username" ], [ userProfile.username ]) }
                                &nbsp;
                                <span className="font-normal text-[#4A4A4A]">{ LocalizeText("profile.last_login.text", [ "time" ], [ FriendlyTime.format(userProfile.secondsSinceLastVisit, ".ago", 2) ])}</span>
                            </p>
                        </div>
                        <div className="flex justify-end gap-1">
                            <div className="illumina-btn-group flex">
                                { getFriend(userProfile.id) && <>
                                    <button className="illumina-btn-primary flex h-7 items-center justify-center pl-2" onClick={ event => processAction("message") }>
                                        <i className="block size-3.5 cursor-pointer bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-180px_-98px]" />
                                    </button>
                                    <button className="illumina-btn-primary flex h-7 w-[15px] items-center justify-center" disabled>
                                        <div className="h-[13px] w-0.5 border-r border-[#919191] bg-white dark:border-[#36322C] dark:bg-black" />
                                    </button>
                                    <button className="illumina-btn-primary flex h-7 items-center justify-center pr-2" disabled>
                                        <i className={`block h-4 w-[15px] cursor-pointer bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] ${ userProfile.isOnline ? "bg-[-197px_-83px]" : "bg-[-229px_-83px]" }`} />
                                    </button>
                                </> }
                            </div>
                            { !getFriend(userProfile.id) &&
                                <button className="illumina-btn-primary flex size-7 items-center justify-center" disabled>
                                    <i className={`block h-4 w-[15px] cursor-pointer bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] ${ userProfile.isOnline ? "bg-[-197px_-83px]" : "bg-[-229px_-83px]" }`} />
                                </button> }
                            { canRequestFriend(userProfile.id) &&
                                <Button className="!size-7 !px-0" onClick={ event => processAction("friend") }>
                                    <i className="block size-4 cursor-pointer bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-197px_-100px]" />
                                </Button> }
                            { !(userProfile.id === GetSessionDataManager().userId) &&
                                <Button className="!size-7 !px-0" onClick={ event => processAction("report") }>
                                    <i className="block h-4 w-[15px] cursor-pointer bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-213px_-83px]" />
                                </Button> }
                        </div>
                    </div>
                    <div className="flex items-center gap-2 pb-2.5">
                        <div className="h-0.5 w-2 border-b border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
                        <span className="text-[11px] font-semibold uppercase text-[#646464] [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("friendbar.title") } ({ userProfile.friendsCount })</span>
                        <div className="h-0.5 w-[60px] border-b border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
                        <span className="text-[11px] font-semibold uppercase text-[#646464] [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("widget.memenu.myrooms") }</span>
                        <div className="h-0.5 flex-1 border-b border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
                    </div>
                </div>
                <div className="flex h-[385px] pl-px">
                    <div className="h-[385px] w-[163px] shrink-0 bg-[url('/client-assets/images/profile/spritesheet.png?v=2451779')] bg-[0px_0px] px-2">
                        { userRelationships && 
                            <div className="mt-1">
                                <RelationshipsContainerView relationships={ userRelationships } />
                            </div> }
                    </div>
                    <div className="h-96 w-0.5 border-r border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
                    <div className="w-full px-2">
                        <div className="mb-5">
                            <RoomsContainerView userProfileUsername={ userProfile.username } onClose={ onClose } />
                        </div>
                        <div className="mb-5">
                            <div className="flex items-center gap-2 pb-[15px]">
                                <span className="text-[11px] font-semibold uppercase text-[#646464] [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("navigator.searchcode.title.my_groups") }</span>
                                <div className="h-0.5 flex-1 border-b border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
                            </div>
                            <GroupsContainerView itsMe={ userProfile.id === GetSessionDataManager().userId } groups={ userProfile.groups } />
                        </div>
                        <div className="mb-5">
                            <div className="flex items-center gap-2 pb-[15px]">
                                <span className="text-[11px] font-semibold uppercase text-[#646464] [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("widget.memenu.badges") }</span>
                                <div className="h-0.5 flex-1 border-b border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
                            </div>
                            <div className="flex items-center gap-3">
                                <BadgesContainerView badges={ userBadges } isShadow={ true } />
                            </div>
                        </div>
                        <div className="absolute bottom-5 right-[21px] h-[89px] w-[123px] shrink-0 bg-[url('/client-assets/images/profile/spritesheet.png?v=2451779')] bg-[-164px_-297px]" />
                    </div>
                </div>
            </NitroBigCardContentView>
        </NitroBigCardView>
    )
}
