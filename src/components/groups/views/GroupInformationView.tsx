import { GroupDeleteComposer, GroupInformationParser, GroupRemoveMemberComposer } from "@nitrots/nitro-renderer"
import { FC } from "react"
import { CatalogPageName, CreateLinkEvent, GetGroupManager, GetGroupMembers, GetSessionDataManager, GroupMembershipType, GroupType, LocalizeText, SendMessageComposer, TryJoinGroup, TryVisitRoom } from "../../../api"
import { Button, GridProps, LayoutBadgeImageView } from "../../../common"
import { useNotification } from "../../../hooks"

const STATES: string[] = [ "regular", "exclusive", "private" ]

interface GroupInformationViewProps extends GridProps
{
    groupInformation: GroupInformationParser;
    onJoin?: () => void;
    onClose?: () => void;
}

export const GroupInformationView: FC<GroupInformationViewProps> = props =>
{
    const { groupInformation = null, onClose = null, overflow = "hidden", ...rest } = props
    const { showConfirm = null } = useNotification()
    const isMod = GetSessionDataManager().isModerator

    const isRealOwner = (groupInformation.ownerName === GetSessionDataManager().userName)

    const deleteGroup = () =>
    {
        if(!groupInformation || (groupInformation.id <= 0) && (groupInformation.ownerName === GetSessionDataManager().userName || isMod)) return

        showConfirm(LocalizeText("group.deleteconfirm.desc"), () =>
        {
            SendMessageComposer(new GroupDeleteComposer(groupInformation.id))
                
            if(onClose) onClose()
        }, null, null, null, LocalizeText("group.deleteconfirm.title"))
    }

    const joinGroup = () => (groupInformation && TryJoinGroup(groupInformation.id))

    const leaveGroup = () =>
    {
        showConfirm(LocalizeText("group.leaveconfirm.desc"), () =>
        {
            SendMessageComposer(new GroupRemoveMemberComposer(groupInformation.id, GetSessionDataManager().userId))

            if(onClose) onClose()
        }, null)
    }

    const getRoleIcon = () =>
    {
        if(groupInformation.membershipType === GroupMembershipType.NOT_MEMBER || groupInformation.membershipType === GroupMembershipType.REQUEST_PENDING) return <div className="h-[18px] w-[19px]" />

        if(isRealOwner) return <i className="block h-[18px] w-[19px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-310px_-124px]" />

        if(groupInformation.isAdmin) return <i className="block h-[18px] w-[19px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-330px_-124px]" />

        return <i className="block h-[18px] w-[19px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-351px_-124px]" />
    }

    const getButtonText = () =>
    {
        if(groupInformation.type === GroupType.PRIVATE && groupInformation.membershipType !== GroupMembershipType.MEMBER) return ""

        if(groupInformation.membershipType === GroupMembershipType.MEMBER) return "group.leave"

        if((groupInformation.membershipType === GroupMembershipType.NOT_MEMBER) && groupInformation.type === GroupType.REGULAR) return "group.join"

        if(groupInformation.membershipType === GroupMembershipType.REQUEST_PENDING) return "group.membershippending"

        if((groupInformation.membershipType === GroupMembershipType.NOT_MEMBER) && groupInformation.type === GroupType.EXCLUSIVE) return "group.requestmembership"
    }

    const getGroupTypeIcon = {
        0: "bg-[-246px_-125px] w-3.5 h-4",
        1: "bg-[-261px_-125px] w-4 h-3",
        2: "bg-[-278px_-125px] w-[15px] h-4"
    }

    const handleButtonClick = () =>
    {
        if((groupInformation.type === GroupType.PRIVATE) && (groupInformation.membershipType === GroupMembershipType.NOT_MEMBER)) return

        if(groupInformation.membershipType === GroupMembershipType.MEMBER)
        {
            leaveGroup()

            return
        }

        joinGroup()
    }

    const handleAction = (action: string) =>
    {
        switch(action)
        {
        case "members":
            GetGroupMembers(groupInformation.id)
            break
        case "members_pending":
            GetGroupMembers(groupInformation.id, 2)
            break
        case "manage":
            GetGroupManager(groupInformation.id)
            break
        case "homeroom":
            TryVisitRoom(groupInformation.roomId)
            break
        case "furniture":
            CreateLinkEvent("catalog/open/" + CatalogPageName.GUILD_CUSTOM_FURNI)
            break
        case "popular_groups":
            CreateLinkEvent("navigator/search/groups")
            break
        }
    }

    if(!groupInformation) return null

    return (
        <div className="flex flex-col">
            <div className="flex gap-2">
                <div className="mt-[11px] flex w-[90px] shrink-0 flex-col items-center">
                    <div className="mb-3.5 w-[70px] overflow-hidden">
                        <LayoutBadgeImageView className="!size-[70px] scale-[1.8] bg-center bg-no-repeat" badgeCode={ groupInformation.badge } isGroup={ true } />
                    </div>
                    <p className="mb-1 cursor-pointer text-center text-sm font-semibold !leading-3 underline [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]" onClick={ () => handleAction("members") }>{ LocalizeText("group.membercount", [ "totalMembers" ], [ groupInformation.membersCount.toString() ]) }</p>
                    { (groupInformation.pendingRequestsCount > 0) && <p className="mb-1 cursor-pointer text-center text-sm font-semibold !leading-3 underline [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]" onClick={ () => handleAction("members_pending") }>{ LocalizeText("group.pendingmembercount", [ "amount" ], [ groupInformation.pendingRequestsCount.toString() ]) }</p> }
                    { (isMod || isRealOwner) && <p className="mb-[3px] cursor-pointer text-center text-sm !leading-3 underline" onClick={ () => handleAction("manage") }>{ LocalizeText("group.manage") }</p> }
                    { (isMod || isRealOwner) && <p className="mb-[3px] cursor-pointer text-center text-sm !leading-3 underline" onClick={ deleteGroup }>{ LocalizeText("group.delete") }</p> }
                </div>
                <div className="flex flex-col">
                    <div className="w-60">
                        <div className="flex items-center gap-0.5 pb-1.5">
                            <i className={ `block bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] ${getGroupTypeIcon[groupInformation.type]}` } />
                            { groupInformation.canMembersDecorate && <i className="block size-[15px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-294px_-125px]" /> }
                            <p className="text-sm font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ groupInformation.title }</p>
                        </div>
                        <p className="mb-[3px] truncate text-clip text-xs !leading-3">{ LocalizeText("group.created", [ "date", "owner" ], [ groupInformation.createdAt, groupInformation.ownerName ]) }</p>
                        <p className="illumina-scrollbar mb-1.5 h-[52px] break-all text-sm !leading-3">{ groupInformation.description }</p>
                    </div>
                    <div className="mb-[25px]">
                        <p className="mb-[7px] cursor-pointer text-sm !leading-3 underline" onClick={ () => handleAction("homeroom") }>{ LocalizeText("group.linktobase") }</p>
                        <p className="mb-[7px] cursor-pointer text-sm !leading-3 underline" onClick={ () => handleAction("furniture") }>{ LocalizeText("group.buyfurni") }</p>
                        <p className="mb-[7px] cursor-pointer text-sm !leading-3 underline" onClick={ () => handleAction("popular_groups") }>{ LocalizeText("group.showgroups") }</p>
                    </div>
                </div>
            </div> 
            { (groupInformation.type !== GroupType.PRIVATE || groupInformation.type === GroupType.PRIVATE && groupInformation.membershipType === GroupMembershipType.MEMBER) &&
                <div className="flex items-center gap-[39px] px-[35px]">
                    { getRoleIcon() }
                    {!isRealOwner &&
                        <Button className={`${((groupInformation.membershipType === GroupMembershipType.NOT_MEMBER) && groupInformation.type === GroupType.EXCLUSIVE) || (groupInformation.membershipType === GroupMembershipType.REQUEST_PENDING) ? "w-[260px]" : "w-40"}`} disabled={ (groupInformation.membershipType === GroupMembershipType.REQUEST_PENDING) } onClick={ handleButtonClick }>
                            { LocalizeText(getButtonText()) }
                        </Button> }
                </div> }
        </div>
    )
}
