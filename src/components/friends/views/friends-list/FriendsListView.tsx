import { HabboSearchComposer, HabboSearchResultData, HabboSearchResultEvent, ILinkEventTracker, RemoveFriendComposer, SendRoomInviteComposer } from "@nitrots/nitro-renderer"
import { FC, useCallback, useEffect, useMemo, useState } from "react"
import { AddEventLinkTracker, LocalizeText, MessengerFriend, RemoveLinkEventTracker, SendMessageComposer } from "../../../../api"
import { Button, NitroCardContentView, NitroCardHeaderView, NitroCardView } from "../../../../common"
import { useFriends, useMessageEvent } from "../../../../hooks"
import { FriendsRemoveConfirmationView } from "./FriendsListRemoveConfirmationView"
import { FriendsRoomInviteView } from "./FriendsListRoomInviteView"
import { FriendsListGroupView } from "./friends-list-group/FriendsListGroupView"

export const FriendsListView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState<boolean>(false)
    const [ isRequestVisible, setIsRequestVisible ] = useState<boolean>(false)
    const [ searchValue, setSearchValue ] = useState<string>("")
    const [ friendResults, setFriendResults ] = useState<HabboSearchResultData[]>(null)
    const [ otherResults, setOtherResults ] = useState<HabboSearchResultData[]>(null)
    const [ selectedFriendsIds, setSelectedFriendsIds ] = useState<number[]>([])
    const [ showRoomInvite, setShowRoomInvite ] = useState<boolean>(false)
    const [ showRemoveFriendsConfirmation, setShowRemoveFriendsConfirmation ] = useState<boolean>(false)
    const { onlineFriends = [], offlineFriends = [], requests = [], requestFriend = null, requestResponse = null } = useFriends()

    const removeFriendsText = useMemo(() =>
    {
        if(!selectedFriendsIds || !selectedFriendsIds.length) return ""

        const userNames: string[] = []

        for(const userId of selectedFriendsIds)
        {
            let existingFriend: MessengerFriend = onlineFriends.find(f => f.id === userId)

            if(!existingFriend) existingFriend = offlineFriends.find(f => f.id === userId)

            if(!existingFriend) continue

            userNames.push(existingFriend.name)
        }

        return LocalizeText("friendlist.removefriendconfirm.userlist", [ "user_names" ], [ userNames.join(", ") ])
    }, [ offlineFriends, onlineFriends, selectedFriendsIds ])

    const selectFriend = useCallback((userId: number) =>
    {
        if(userId < 0) return

        setSelectedFriendsIds(prevValue =>
        {
            const newValue = [ ...prevValue ]

            const existingUserIdIndex: number = newValue.indexOf(userId)

            if(existingUserIdIndex > -1)
            {
                newValue.splice(existingUserIdIndex, 1)
            }
            else
            {
                newValue.push(userId)
            }

            return newValue
        })
    }, [ setSelectedFriendsIds ])

    const sendRoomInvite = (message: string) =>
    {
        if(!selectedFriendsIds.length || !message || !message.length || (message.length > 255)) return
        
        SendMessageComposer(new SendRoomInviteComposer(message, selectedFriendsIds))

        setShowRoomInvite(false)
    }

    const removeSelectedFriends = () =>
    {
        if(selectedFriendsIds.length === 0) return

        setSelectedFriendsIds(prevValue =>
        {
            SendMessageComposer(new RemoveFriendComposer(...prevValue))

            return []
        })

        setShowRemoveFriendsConfirmation(false)
    }

    useMessageEvent<HabboSearchResultEvent>(HabboSearchResultEvent, event =>
    {
        const parser = event.getParser()

        setFriendResults(parser.friends)
        setOtherResults(parser.others)
    })
    
    useEffect(() =>
    {
        if(!searchValue || !searchValue.length) return

        const timeout = setTimeout(() =>
        {
            if(!searchValue || !searchValue.length) return

            SendMessageComposer(new HabboSearchComposer(searchValue))
        }, 500)

        return () => clearTimeout(timeout)
    }, [ searchValue ])

    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived: (url: string) =>
            {
                const parts = url.split("/")

                if(parts.length < 2) return
        
                switch(parts[1])
                {
                case "show":
                    setIsVisible(true)
                    return
                case "hide":
                    setIsVisible(false)
                    return
                case "toggle":
                    setIsVisible(prevValue => !prevValue)
                    return
                case "request":
                    if(parts.length < 4) return

                    requestFriend(parseInt(parts[2]), parts[3])
                }
            },
            eventUrlPrefix: "friends/"
        }

        AddEventLinkTracker(linkTracker)

        return () => RemoveLinkEventTracker(linkTracker)
    }, [ requestFriend ])

    if(!isVisible) return null

    return (
        <>
            <NitroCardView uniqueKey="friends" className="illumina-friends h-[373px] w-[287px]">
                <NitroCardHeaderView headerText={ LocalizeText("friendlist.friends") } onCloseClick={ event => setIsVisible(false) } />
                <NitroCardContentView className="h-full">
                    <div className="h-full">
                        <div className="flex flex-col overflow-hidden">
                            { searchValue?.length === 0 && isRequestVisible && <div className="h-[250px]">
                                <div className="flex h-full flex-col">
                                    <div className="illumina-scrollbar mb-3.5 flex-1">
                                        <div className="mb-1.5 flex items-center gap-2">
                                            <p className="text-[13px] font-semibold !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("friendlist.tab.friendrequests") + ` (${ requests.length })` }</p>
                                            <div className="h-0.5 flex-1 border-b border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
                                        </div>
                                        <div className="flex-1">
                                            <FriendsListGroupView requests={ requests } selectedFriendsIds={ selectedFriendsIds } selectFriend={ selectFriend } />
                                        </div>
                                    </div>
                                    <div className="illumina-previewer flex flex-col gap-1 p-1.5">
                                        {/* <Button className="w-full !justify-start gap-1" onClick={ event => requestResponse(-1, true) }>
                                            <i className="block h-3.5 w-4 cursor-pointer bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-180px_-83px]" />
                                            { LocalizeText("friendlist.requests.acceptall") }
                                        </Button> */}
                                        <Button className="w-full !justify-start gap-1" onClick={ event => requestResponse(-1, false) }>
                                            <i className="block size-[13px] cursor-pointer bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-226px_-100px]" />
                                            { LocalizeText("friendlist.requests.dismissall") }
                                        </Button>
                                    </div>
                                </div>
                            </div> }
                            { searchValue?.length === 0 && !isRequestVisible && <div className="illumina-scrollbar h-[250px]">
                                <div className="mb-3">
                                    <div className="mb-1.5 flex items-center gap-2">
                                        <p className="text-[13px] font-semibold !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("friendlist.friends") + ` (${ onlineFriends.length })` }</p>
                                        <div className="h-0.5 flex-1 border-b border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
                                    </div>
                                    <FriendsListGroupView list={ onlineFriends } selectedFriendsIds={ selectedFriendsIds } selectFriend={ selectFriend } />
                                </div>
                                <div>
                                    <div className="mb-1.5 flex items-center gap-2">
                                        <p className="text-[13px] font-semibold !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("friendlist.friends.offlinecaption") + ` (${ offlineFriends.length })` }</p>
                                        <div className="h-0.5 flex-1 border-b border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
                                    </div>
                                    <FriendsListGroupView list={ offlineFriends } selectedFriendsIds={ selectedFriendsIds } selectFriend={ selectFriend } />
                                </div>
                            </div> }
                            { searchValue?.length > 0 && !isRequestVisible && <div className="illumina-scrollbar h-[250px]">
                                <div className="mb-3">
                                    <div className="mb-1.5 flex items-center gap-2">
                                        <p className="text-[13px] font-semibold !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("friendlist.search.friendscaption", [ "cnt" ], [ friendResults?.length.toString() ]) }</p>
                                        <div className="h-0.5 flex-1 border-b border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
                                    </div>
                                    <FriendsListGroupView searchList={ friendResults } />
                                </div>
                                <div>
                                    <div className="mb-1.5 flex items-center gap-2">
                                        <p className="text-[13px] font-semibold !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("friendlist.search.otherscaption", [ "cnt" ], [ otherResults?.length.toString() ]) }</p>
                                        <div className="h-0.5 flex-1 border-b border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
                                    </div>
                                    <FriendsListGroupView searchListOther={ otherResults } />
                                </div>
                            </div> }
                        </div>
                        <div className="mb-[7px] mt-1 h-0.5 w-full border-b border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
                        <input type="text" className="illumina-input !h-6 w-full px-2 !text-[13px]" placeholder={ LocalizeText("generic.search") } value={ searchValue } maxLength={ 50 } onChange={ event => { setSearchValue(event.target.value), setIsRequestVisible(false) } } />
                        <div className="illumina-previewer mt-1 flex items-center justify-between px-1 py-1.5">
                            <Button className="!px-1" onClick={ () => setShowRoomInvite(true) } disabled={ !(selectedFriendsIds && selectedFriendsIds.length > 0) }>
                                <i className="block h-4 w-[17px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-426px_-84px]" />
                            </Button>
                            <div className="flex gap-1">
                                <Button className="!px-1.5" onClick={ event => setShowRemoveFriendsConfirmation(true) } disabled={ !(selectedFriendsIds && selectedFriendsIds.length > 0) }>
                                    <i className="block size-[13px] cursor-pointer bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-226px_-100px]" />
                                </Button>
                                { requests.length > 0
                                    ? <>
                                        { isRequestVisible
                                            ? <Button className="gap-1 !px-1.5" onClick={ () => setIsRequestVisible(false) }>
                                                <p>{ LocalizeText("generic.back") }</p>
                                            </Button>
                                            : <Button variant="orange" className="gap-1 !px-1.5" onClick={ () => { setIsRequestVisible(true), setSearchValue("") } }>
                                                <i className="block size-4 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-197px_-100px]" />
                                                <p>{ LocalizeText("friendbar.request.title") } ({ requests.length })</p>
                                            </Button>
                                        }
                                    </>
                                    : <>
                                        { isRequestVisible &&
                                            <Button className="gap-1 !px-1.5" onClick={ () => setIsRequestVisible(false) }>
                                                <p>{ LocalizeText("generic.back") }</p>
                                            </Button> }
                                    </> }
                            </div>
                        </div>
                    </div>
                </NitroCardContentView>
            </NitroCardView>
            { showRoomInvite &&
                <FriendsRoomInviteView selectedFriendsIds={ selectedFriendsIds } onCloseClick={ () => setShowRoomInvite(false) } sendRoomInvite={ sendRoomInvite } /> }
            { showRemoveFriendsConfirmation && 
                <FriendsRemoveConfirmationView selectedFriendsIds={ selectedFriendsIds } removeFriendsText={ removeFriendsText } onCloseClick={ () => setShowRemoveFriendsConfirmation(false) } removeSelectedFriends={ removeSelectedFriends } /> }
        </>
    )
}
