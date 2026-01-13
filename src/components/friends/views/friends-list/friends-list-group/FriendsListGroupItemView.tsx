import { HabboSearchResultData } from "@nitrots/nitro-renderer"
import { FC, MouseEvent, useEffect, useRef, useState } from "react"
import { GetUserProfile, MessengerFriend, MessengerRequest, OpenMessengerChat } from "../../../../../api"
import { LayoutAvatarImageView, LayoutBadgeImageView } from "../../../../../common"
import { useFriends } from "../../../../../hooks"

export interface FriendsListGroupItemViewProps
{
    friend?: MessengerFriend
    request?: MessengerRequest
    searchFriend?: HabboSearchResultData
    isSearch?: boolean
    isFriend?: boolean
    selected?: boolean
    selectFriend?: (userId: number) => void
}

export const FriendsListGroupItemView: FC<FriendsListGroupItemViewProps> = props =>
{
    const { friend = null, request = null, searchFriend = null, isSearch = false, isFriend = false, selected = false, selectFriend = null } = props
    const [ isRelationshipOpen, setIsRelationshipOpen ] = useState<boolean>(false)
    const { followFriend = null, updateRelationship = null, canRequestFriend = null, requestFriend = null, requestResponse = null } = useFriends()

    const relationshipRef = useRef(null)

    const clickFollowFriend = (event: MouseEvent<HTMLDivElement>) =>
    {
        event.stopPropagation()

        followFriend(friend)
    }

    const openMessengerChat = (friendId: number) => (event: MouseEvent<HTMLDivElement>) =>
    {
        event.stopPropagation()
        OpenMessengerChat(friendId)
    }

    const openRelationship = (event: MouseEvent<HTMLDivElement>) =>
    {
        event.stopPropagation()
        setIsRelationshipOpen(prevState => !prevState)
    }

    const clickUpdateRelationship = (event: MouseEvent<HTMLDivElement>, type: number) =>
    {
        event.stopPropagation()

        updateRelationship(friend, type)
        
        setIsRelationshipOpen(false)
    }
    
    const getCurrentRelationshipName = () =>
    {
        if(!friend) return "!bg-none"

        switch(friend.relationshipStatus)
        {
        case MessengerFriend.RELATIONSHIP_HEART: return "bg-[-292px_-23px]"
        case MessengerFriend.RELATIONSHIP_SMILE: return "bg-[-320px_-23px]"
        case MessengerFriend.RELATIONSHIP_BOBBA: return "bg-[-306px_-23px]"
        default: return "!bg-none"
        }
    }

    useEffect(() => {
        const handleClickOutside: any = (event: MouseEvent) => {
            if (relationshipRef.current && !relationshipRef.current.contains(event.target as Node)) {
                setIsRelationshipOpen(false)
            }
        }
    
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    if(searchFriend && isSearch) return (
        <div className="illumina-card-item relative flex h-[26px] items-center pr-2.5">
            <div className="flex h-[26px] flex-1 items-center">
                { searchFriend.isAvatarOnline || isFriend
                    ? <LayoutAvatarImageView className={`!h-[52px] !w-8 !bg-[center_-25px] [image-rendering:initial] ${selected ? "drop-shadow-[0px_1px_0_#33312B]" : "drop-shadow-[0px_1px_0_#fff] dark:drop-shadow-[0px_1px_0_#33312B]"}`} figure={ searchFriend.avatarFigure } headOnly={ true } direction={ 3 } scale={ 0.50 } />
                    : <div className="h-[52px] w-8" /> }
                <div className="flex items-center gap-1">
                    <div className="cursor-pointer" onClick={ event => GetUserProfile(searchFriend.avatarId) }>
                        <i className={`mt-px block h-3 w-4 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] ${selected ? "bg-[-436px_-13px]" : "bg-[-436px_0px]"}`} />
                    </div>
                    <p className={`text-xs font-semibold !leading-3 ${selected ? "text-white [text-shadow:_0_1px_0_#33312B]" : "[text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]" }`}>{ searchFriend.avatarName }</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                { isFriend &&
                    <div className="cursor-pointer" onClick={ openMessengerChat(searchFriend.avatarId) }>
                        <i className={`block size-3.5 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] ${selected ? "bg-[-242px_-100px]" : "bg-[-180px_-98px]"}`} />
                    </div> }
                { canRequestFriend(searchFriend.avatarId) && !isFriend &&
                    <div className="cursor-pointer" onClick={ event => requestFriend(searchFriend.avatarId, searchFriend.avatarName) }>
                        <i className="block size-4 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-197px_-100px]" />
                    </div> }
            </div>
        </div>
    )

    if(request && !isSearch) return (
        <div className="illumina-card-item relative flex h-[26px] items-center pr-2.5">
            <div className="flex h-[26px] flex-1 items-center">
                { request.id > 0 && <LayoutAvatarImageView className="!h-[52px] !w-8 !bg-[center_-25px] drop-shadow-[0px_1px_0_#fff] [image-rendering:initial] dark:drop-shadow-[0px_1px_0_#33312B]" figure={ request.figureString } headOnly={ true } direction={ 3 } scale={ 0.50 } /> }
                <div className="flex items-center gap-1">
                    <div className="cursor-pointer" onClick={ event => GetUserProfile(request.id) }>
                        <i className="mt-px block h-3 w-4 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-436px_0px]" />
                    </div>
                    <p className="text-xs font-semibold !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ request.name }</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <div className="nitro-friends-spritesheet icon-accept cursor-pointer" onClick={ event => requestResponse(request.id, true) }>
                    <i className="block h-3.5 w-4 cursor-pointer bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-180px_-83px]" />
                </div>
                <div className="nitro-friends-spritesheet icon-deny cursor-pointer" onClick={ event => requestResponse(request.id, false) }>
                    <i className="block size-[13px] cursor-pointer bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-226px_-100px]" />
                </div>
            </div>
        </div>
    )

    if(friend && !isSearch) return (
        <div className={ `illumina-card-item relative flex h-[26px] cursor-pointer items-center pr-2.5 ${selected ? "dark" : ""}` } onClick={ event => selectFriend(friend.id) }>
            <div className="flex h-[26px] flex-1 items-center">
                { friend.id > 0 && friend.online && <LayoutAvatarImageView className={`!h-[52px] !w-8 !bg-[center_-25px] [image-rendering:initial] ${selected ? "drop-shadow-[0px_1px_0_#33312B]" : "drop-shadow-[0px_1px_0_#fff] dark:drop-shadow-[0px_1px_0_#33312B]"}`} figure={ friend.figure } headOnly={ true } direction={ 3 } scale={ 0.50 } /> }
                { friend.id > 0 && !friend.online && <div className="h-[52px] w-8" /> }
                { friend.id <= 0 && <LayoutBadgeImageView className="!size-8 bg-center bg-no-repeat [image-rendering:initial]" badgeCode={ friend.figure } scale={ 0.6 } /> }
                <div className="flex items-center gap-1">
                    <div className="cursor-pointer" onClick={ event => GetUserProfile(friend.id) }>
                        <i className={`mt-px block h-3 w-4 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] ${selected ? "bg-[-436px_-13px]" : "bg-[-436px_0px]"}`} />
                    </div>
                    <p className={`text-xs font-semibold !leading-3 ${selected ? "text-white [text-shadow:_0_1px_0_#33312B]" : "[text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]" }`}>{ friend.name }</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <i className={`h-3.5 w-[13px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] ${ getCurrentRelationshipName() }`} />
                <div className="cursor-pointer" onClick={ openRelationship }>
                    <i className="block h-[5px] w-[9px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-282px_-23px]" />
                </div>
                <div className={`h-[13px] w-0.5 border-r ${selected ? "border-[#33312B] bg-black" : "border-white bg-[#CCCCCC] dark:border-[#36322c] dark:bg-black"}`} />
                <div className="cursor-pointer" onClick={ openMessengerChat(friend.id) }>
                    <i className={`block size-3.5 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] ${selected ? "bg-[-242px_-100px]" : "bg-[-180px_-98px]"}`} />
                </div>
                { friend.followingAllowed && <>
                    <div className={`h-[13px] w-0.5 border-r ${selected ? "border-[#33312B] bg-black" : "border-white bg-[#CCCCCC] dark:border-[#36322c] dark:bg-black"}`} />
                    <div className="cursor-pointer" onClick={ clickFollowFriend }>
                        <i className={`block h-2.5 w-[9px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] ${selected ? "bg-[-453px_-11px]" : "bg-[-453px_0px]"}`} />
                    </div>
                </> }
            </div>
            { isRelationshipOpen &&
                <div ref={ relationshipRef } className="illumina-card-item absolute right-[60px] top-5 z-10 flex flex-col items-center px-1 py-2">
                    <div className="h-3.5 w-[13px] cursor-pointer" onClick={ event => clickUpdateRelationship(event, MessengerFriend.RELATIONSHIP_NONE) } />
                    <div className="h-3.5 w-[13px] cursor-pointer bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-292px_-23px]" onClick={ event => clickUpdateRelationship(event, MessengerFriend.RELATIONSHIP_HEART) } />
                    <div className="h-3.5 w-[13px] cursor-pointer bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-320px_-23px]" onClick={ event => clickUpdateRelationship(event, MessengerFriend.RELATIONSHIP_SMILE) } />
                    <div className="h-3.5 w-[13px] cursor-pointer bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-306px_-23px]" onClick={ event => clickUpdateRelationship(event, MessengerFriend.RELATIONSHIP_BOBBA) } />
                </div> }
        </div>
    )

    return null
}
