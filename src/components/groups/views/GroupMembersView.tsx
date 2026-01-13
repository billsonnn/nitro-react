import { GroupAdminGiveComposer, GroupAdminTakeComposer, GroupConfirmMemberRemoveEvent, GroupConfirmRemoveMemberComposer, GroupMemberParser, GroupMembersComposer, GroupMembersEvent, GroupMembershipAcceptComposer, GroupMembershipDeclineComposer, GroupMembersParser, GroupRank, GroupRemoveMemberComposer, ILinkEventTracker } from "@nitrots/nitro-renderer"
import { FC, useCallback, useEffect, useState } from "react"
import { AddEventLinkTracker, GetSessionDataManager, GetUserProfile, LocalizeText, RemoveLinkEventTracker, SendMessageComposer } from "../../../api"
import { Button, LayoutAvatarImageView, LayoutBadgeImageView, NitroCardContentView, NitroCardHeaderView, NitroCardView } from "../../../common"
import { useMessageEvent, useNotification } from "../../../hooks"

export const GroupMembersView: FC<{}> = props =>
{
    const [ groupId, setGroupId ] = useState<number>(-1)
    const [ levelId, setLevelId ] = useState<number>(-1)
    const [ membersData, setMembersData ] = useState<GroupMembersParser>(null)
    const [ pageId, setPageId ] = useState<number>(-1)
    const [ totalPages, setTotalPages ] = useState<number>(0)
    const [ searchQuery, setSearchQuery ] = useState<string>("")
    const [ removingMemberName, setRemovingMemberName ] = useState<string>(null)
    const { showConfirm = null } = useNotification()
    const isMod = GetSessionDataManager().isModerator

    const refreshMembers = useCallback(() =>
    {
        if((groupId === -1) || (levelId === -1) || (pageId === -1)) return

        SendMessageComposer(new GroupMembersComposer(groupId, pageId, searchQuery, levelId))
    }, [ groupId, levelId, pageId, searchQuery ])

    const toggleAdmin = (member: GroupMemberParser) =>
    {
        if(!membersData.admin || (member.rank === GroupRank.OWNER)) return
        
        if(member.rank !== GroupRank.ADMIN) SendMessageComposer(new GroupAdminGiveComposer(membersData.groupId, member.id))
        else SendMessageComposer(new GroupAdminTakeComposer(membersData.groupId, member.id))

        refreshMembers()
    }

    const acceptMembership = (member: GroupMemberParser) =>
    {
        if(!membersData.admin || (member.rank !== GroupRank.REQUESTED)) return
        
        SendMessageComposer(new GroupMembershipAcceptComposer(membersData.groupId, member.id))

        refreshMembers()
    }

    const removeMemberOrDeclineMembership = (member: GroupMemberParser) =>
    {
        if(!membersData.admin) return

        if(member.rank === GroupRank.REQUESTED)
        {
            SendMessageComposer(new GroupMembershipDeclineComposer(membersData.groupId, member.id))

            refreshMembers()

            return
        }
        
        setRemovingMemberName(member.name)
        SendMessageComposer(new GroupConfirmRemoveMemberComposer(membersData.groupId, member.id))
    }

    useMessageEvent<GroupMembersEvent>(GroupMembersEvent, event =>
    {
        const parser = event.getParser()

        setMembersData(parser)
        setLevelId(parser.level)
        setTotalPages(Math.ceil(parser.totalMembersCount / parser.pageSize))
    })

    useMessageEvent<GroupConfirmMemberRemoveEvent>(GroupConfirmMemberRemoveEvent, event =>
    {
        const parser = event.getParser()

        showConfirm(LocalizeText(((parser.furnitureCount > 0) ? "group.kickconfirm.desc" : "group.kickconfirm_nofurni.desc"), [ "user", "amount" ], [ removingMemberName, parser.furnitureCount.toString() ]), () =>
        {
            SendMessageComposer(new GroupRemoveMemberComposer(membersData.groupId, parser.userId))

            refreshMembers()
        }, null)
            
        setRemovingMemberName(null)
    })

    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived: (url: string) =>
            {
                const parts = url.split("/")
        
                if(parts.length < 2) return
        
                const groupId = (parseInt(parts[1]) || -1)
                const levelId = (parseInt(parts[2]) || 3)
                
                setGroupId(groupId)
                setLevelId(levelId)
                setPageId(0)
            },
            eventUrlPrefix: "group-members/"
        }

        AddEventLinkTracker(linkTracker)

        return () => RemoveLinkEventTracker(linkTracker)
    }, [])

    useEffect(() =>
    {
        setPageId(0)
    }, [ groupId, levelId, searchQuery ])

    useEffect(() =>
    {
        if((groupId === -1) || (levelId === -1) || (pageId === -1)) return

        SendMessageComposer(new GroupMembersComposer(groupId, pageId, searchQuery, levelId))
    }, [ groupId, levelId, pageId, searchQuery ])

    useEffect(() =>
    {
        if(groupId === -1) return

        setLevelId(-1)
        setMembersData(null)
        setTotalPages(0)
        setSearchQuery("")
        setRemovingMemberName(null) 
    }, [ groupId ])

    if((groupId === -1) || !membersData) return null

    return (
        <NitroCardView uniqueKey="group-members" className="illumina-group-members h-[430px] w-[352px]" customZIndex={ 502 }>
            <NitroCardHeaderView headerText={ LocalizeText("group.members.title", [ "groupName" ], [ membersData ? membersData.groupTitle : "" ]) } onCloseClick={ event => setGroupId(-1) } />
            <NitroCardContentView className="h-full">
                <div className="flex h-full flex-col">
                    <div className="mb-[9px] flex items-center gap-1">
                        <div className="flex w-[75px] items-center justify-center">
                            <LayoutBadgeImageView className="shrink-0" badgeCode={ membersData.badge } isGroup={ true } />
                        </div>
                        <div className="flex w-full flex-col gap-2">
                            <input type="text" className="illumina-input h-[26px] w-full px-1.5" placeholder={ LocalizeText("group.members.searchinfo") } value={ searchQuery } onChange={ event => setSearchQuery(event.target.value) } />
                            <div className="illumina-select relative flex h-[26px] items-center gap-[3px] px-2.5">
                                <select className="w-full bg-transparent" value={ levelId } onChange={ event => setLevelId(parseInt(event.target.value)) }>
                                    <option className="!text-black" value="0">{ LocalizeText("group.members.search.all") }</option>
                                    <option className="!text-black" value="1">{ LocalizeText("group.members.search.admins") }</option>
                                    <option className="!text-black" value="2">{ LocalizeText("group.members.search.pending") }</option>
                                </select>
                                <i className="pointer-events-none h-2 w-3 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-269px_-23px]" />
                            </div>
                        </div>
                    </div>
                    <div className="grid flex-1 grid-cols-2 grid-rows-[max-content] content-start gap-[5px]">
                        { membersData.result.map((member, index) => (
                            <div key={ index } className="illumina-card-item flex h-[35px] w-[164px] items-center gap-1.5 overflow-hidden">
                                <div className="shrink-0" onClick={ () => GetUserProfile(member.id) }>
                                    <LayoutAvatarImageView className="!h-[34px] !w-[29px] !bg-[-34px_-37px]" figure={ member.figure } headOnly={ true } direction={ 2 } />
                                </div>
                                <div className="flex w-[126px] flex-col gap-0.5">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-semibold !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]" onClick={ event => GetUserProfile(member.id) }>{ member.name }</p>
                                        { membersData.admin && (member.rank !== GroupRank.OWNER) && (member.id !== GetSessionDataManager().userId) &&
                                            <div className="cursor-pointer" onClick={ event => removeMemberOrDeclineMembership(member) }>
                                                <i className="block size-[11px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-63px_-207px]" />
                                            </div> }
                                    </div>
                                    { (member.rank !== GroupRank.REQUESTED) && membersData.admin &&
                                        <div className="group flex items-center">
                                            <div className="h-[13px] w-[18px] shrink-0">
                                                <i className={`block h-[13px] w-[11px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] ${ ((member.rank === GroupRank.OWNER) ? "w-[13px] bg-[-372px_-129px]" : (member.rank === GroupRank.ADMIN) ? "bg-[-386px_-129px]" : "bg-[-398px_-129px] group-hover:bg-[-386px_-129px]") }`} />
                                            </div>
                                            { member.rank !== GroupRank.OWNER
                                                ? <p className="cursor-pointer truncate text-clip text-xs !leading-3 text-[#757575] underline group-hover:text-black" onClick={ event => toggleAdmin(member) }>{ member.rank === GroupRank.ADMIN ? LocalizeText("group.members.removerights") : LocalizeText("group.members.giverights") }</p>
                                                : <p className="truncate text-clip text-xs italic !leading-3 text-[#757575]">{ LocalizeText("group.members.since", [ "date" ], [ member.joinedAt ]) }</p> }
                                        </div> }
                                    { (member.rank !== GroupRank.REQUESTED) && !membersData.admin &&
                                        <div className="flex items-center">
                                            <div className="h-[13px] w-[18px] shrink-0">
                                                <i className={`block h-[13px] w-[11px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] ${ ((member.rank === GroupRank.OWNER) ? "w-[13px] bg-[-372px_-129px]" : (member.rank === GroupRank.ADMIN) ? "bg-[-386px_-129px]" : "bg-[-398px_-129px]") }`} />
                                            </div>
                                            <p className="truncate text-clip text-xs italic !leading-3 text-[#757575]">{ LocalizeText("group.members.since", [ "date" ], [ member.joinedAt ]) }</p>
                                        </div> }
                                    { membersData.admin && (member.rank === GroupRank.REQUESTED) &&
                                        <div className="flex items-center">
                                            <div className="h-[13px] w-[18px] shrink-0" />
                                            <p className="cursor-pointer truncate text-clip text-xs !leading-3 text-[#757575] underline hover:text-black" onClick={ event => acceptMembership(member) }>{ LocalizeText("group.members.accept") }</p>
                                        </div> }
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center justify-between">
                        {(membersData.pageIndex !== 0)
                            ? <Button variant="primary" className="!w-[26px] !px-0" onClick={ event => setPageId(prevValue => (prevValue - 1)) }>
                                <i className="block h-[9px] w-2.5 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-56px_-118px]" />
                            </Button> 
                            : <div className="size-[26px]" /> }
                        <p className="text-sm">{ LocalizeText("group.members.pageinfo", [ "amount", "page", "totalPages" ], [ membersData.totalMembersCount.toString(), (membersData.pageIndex + 1).toString(), totalPages.toString() ]) }</p>
                        {(membersData.pageIndex !== (totalPages - 1)) && (totalPages !== 0)
                            ? <Button variant="primary" className="!w-[26px] !px-0" onClick={ event => setPageId(prevValue => (prevValue + 1)) }>
                                <i className="block h-[9px] w-2.5 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-56px_-128px]" />
                            </Button> 
                            : <div className="size-[26px]" /> }
                    </div>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    )
}
