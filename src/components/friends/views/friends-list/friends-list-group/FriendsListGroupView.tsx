import { HabboSearchResultData } from "@nitrots/nitro-renderer"
import { FC } from "react"
import { LocalizeText, MessengerFriend, MessengerRequest } from "../../../../../api"
import { FriendsListGroupItemView } from "./FriendsListGroupItemView"

interface FriendsListGroupViewProps
{
    list?: MessengerFriend[];
    requests?: MessengerRequest[];
    searchList?: HabboSearchResultData[];
    searchListOther?: HabboSearchResultData[];
    selectedFriendsIds?: number[];
    selectFriend?: (userId: number) => void;
}

export const FriendsListGroupView: FC<FriendsListGroupViewProps> = props =>
{
    const { list = null, requests = null, searchList = null, searchListOther = null, selectedFriendsIds = null, selectFriend = null } = props

    if(searchList) return (
        <>
            { (searchList.length === 0) &&
                <p className="mt-2 text-xs font-semibold !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("friendlist.search.nofriendsfound") }</p> }
            { (searchList.length > 0) &&
                <div className="flex flex-col gap-1">
                    { searchList.map((result, index) => <FriendsListGroupItemView key={ index } searchFriend={ result } isSearch={ true } isFriend={ true } />)}
                </div> }
        </>
    )

    if(searchListOther) return (
        <>
            { (searchListOther.length === 0) &&
                <p className="mt-2 text-xs font-semibold !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("friendlist.search.noothersfound") }</p> }
            { (searchListOther.length > 0) &&
                <div className="flex flex-col gap-1">
                    { searchListOther.map((result, index) => <FriendsListGroupItemView key={ index } searchFriend={ result } isSearch={ true } />)}
                </div> }
        </>
    )

    if(requests) return (
        <div className="flex flex-col gap-1">
            { requests.map((request, index) => <FriendsListGroupItemView key={ index } request={ request } />) }
        </div>
    )

    if(list) return (
        <div className="flex flex-col gap-1">
            { list.map((item, index) => <FriendsListGroupItemView key={ index } friend={ item } selected={ selectedFriendsIds && (selectedFriendsIds.indexOf(item.id) >= 0) } selectFriend={ selectFriend } />) }
        </div>
    )

    return null
}
