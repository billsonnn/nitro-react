import { DesktopViewEvent, GetGuestRoomResultEvent, GroupInformationComposer, GroupInformationEvent, GroupInformationParser, GroupRemoveMemberComposer, HabboGroupDeactivatedMessageEvent, RoomEntryInfoMessageEvent } from "@nitrots/nitro-renderer"
import { FC, useState } from "react"
import { GetGroupInformation, GetGroupManager, GetSessionDataManager, GroupMembershipType, GroupType, LocalizeText, SendMessageComposer, TryJoinGroup } from "../../../api"
import { Button, LayoutBadgeImageView } from "../../../common"
import { useMessageEvent, useNotification } from "../../../hooks"

export const GroupRoomInformationView: FC<{}> = props =>
{
    const [ expectedGroupId, setExpectedGroupId ] = useState<number>(0)
    const [ groupInformation, setGroupInformation ] = useState<GroupInformationParser>(null)
    const [ isOpen, setIsOpen ] = useState<boolean>(true)
    const { showConfirm = null } = useNotification()

    const isRealOwner = (groupInformation && (groupInformation.ownerName === GetSessionDataManager().userName))

    useMessageEvent<DesktopViewEvent>(DesktopViewEvent, event =>
    {
        setExpectedGroupId(0)
        setGroupInformation(null)
    })

    useMessageEvent<RoomEntryInfoMessageEvent>(RoomEntryInfoMessageEvent, event =>
    {
        setExpectedGroupId(0)
        setGroupInformation(null)
    })

    useMessageEvent<GetGuestRoomResultEvent>(GetGuestRoomResultEvent, event =>
    {
        const parser = event.getParser()

        if(!parser.roomEnter) return

        if(parser.data.habboGroupId > 0)
        {
            setExpectedGroupId(parser.data.habboGroupId)
            SendMessageComposer(new GroupInformationComposer(parser.data.habboGroupId, false))
        }
        else
        {
            setExpectedGroupId(0)
            setGroupInformation(null)
        }
    })

    useMessageEvent<HabboGroupDeactivatedMessageEvent>(HabboGroupDeactivatedMessageEvent, event =>
    {
        const parser = event.getParser()

        if(!groupInformation || ((parser.groupId !== groupInformation.id) && (parser.groupId !== expectedGroupId))) return

        setExpectedGroupId(0)
        setGroupInformation(null)
    })

    useMessageEvent<GroupInformationEvent>(GroupInformationEvent, event =>
    {
        const parser = event.getParser()

        if(parser.id !== expectedGroupId) return

        setGroupInformation(parser)
    })

    const leaveGroup = () =>
    {
        showConfirm(LocalizeText("group.leaveconfirm.desc"), () =>
        {
            SendMessageComposer(new GroupRemoveMemberComposer(groupInformation.id, GetSessionDataManager().userId))
        }, null)
    }

    const getButtonText = () =>
    {
        if(isRealOwner) return "group.manage"

        if(groupInformation.type === GroupType.PRIVATE) return ""

        if(groupInformation.membershipType === GroupMembershipType.MEMBER) return "group.leave"

        if((groupInformation.membershipType === GroupMembershipType.NOT_MEMBER) && groupInformation.type === GroupType.REGULAR) return "group.join"

        if(groupInformation.membershipType === GroupMembershipType.REQUEST_PENDING) return "group.membershippending"

        if((groupInformation.membershipType === GroupMembershipType.NOT_MEMBER) && groupInformation.type === GroupType.EXCLUSIVE) return "group.requestmembership"
    }

    const handleButtonClick = () =>
    {
        if(isRealOwner) return GetGroupManager(groupInformation.id)

        if((groupInformation.type === GroupType.PRIVATE) && (groupInformation.membershipType === GroupMembershipType.NOT_MEMBER)) return

        if(groupInformation.membershipType === GroupMembershipType.MEMBER)
        {
            leaveGroup()

            return
        }

        TryJoinGroup(groupInformation.id)
    }

    if(!groupInformation) return null

    return (
        <div className={`mr-[-3px] mt-[3px] cursor-pointer bg-[url('/client-assets/images/groups/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/groups/spritesheet-dark.png?v=2451779')] ${isOpen ? "h-[119px] w-[195px] bg-[0px_-124px]" : "h-[25px] w-[195px] bg-[-195px_-124px]"}`}>
            <div className="flex h-[22px] items-center gap-4 px-[5px] py-[3px]" onClick={ event => setIsOpen(value => !value) }>
                <i className="h-4 w-[21px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-391px_-143px]" />
                <p className="text-[13px] font-semibold text-white">{ LocalizeText("group.homeroominfo.title") }</p>
            </div>
            { isOpen &&
                <div className="px-3 py-2.5">
                    <div className="mb-2 flex gap-2.5" onClick={ event => GetGroupInformation(groupInformation.id) }>
                        <LayoutBadgeImageView badgeCode={ groupInformation.badge } isGroup={ true } />
                        <p className="text-sm font-semibold text-white">{ groupInformation.title }</p>
                    </div>
                    { (groupInformation.type !== GroupType.PRIVATE || isRealOwner) && (groupInformation.membershipType !== GroupMembershipType.REQUEST_PENDING) && 
                        <Button className="w-full" onClick={ handleButtonClick }>
                            { LocalizeText(getButtonText()) }
                        </Button>
                    }
                </div> }
        </div>
    )
}
