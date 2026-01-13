import { ConvertGlobalRoomIdMessageComposer, FindNewFriendsMessageComposer, HabboWebTools, ILinkEventTracker, LegacyExternalInterface, NavigatorInitComposer, NavigatorSearchComposer, RoomSessionEvent } from "@nitrots/nitro-renderer"
import { FC, useCallback, useEffect, useRef, useState } from "react"
import { AddEventLinkTracker, GetConfiguration, LocalizeText, RemoveLinkEventTracker, SendMessageComposer, TryVisitRoom } from "../../api"
import { DraggableWindowPosition, NitroCardContentView, NitroCardHeaderView, NitroCardTabsItemView, NitroCardTabsView, NitroCardView } from "../../common"
import { useNavigator, useRoomSessionManagerEvent } from "../../hooks"
import { NavigatorDoorStateView } from "./views/NavigatorDoorStateView"
import { NavigatorRoomCreatorView } from "./views/NavigatorRoomCreatorView"
import { NavigatorRoomInfoView } from "./views/NavigatorRoomInfoView"
import { NavigatorRoomSettingsView } from "./views/room-settings/NavigatorRoomSettingsView"
import { NavigatorSearchResultView } from "./views/search/NavigatorSearchResultView"
import { NavigatorSearchView } from "./views/search/NavigatorSearchView"

export const NavigatorView: FC<{}> = props => {
    const [ selectedResult, setSelectedResult ] = useState<Number>(0)
    const [ isVisible, setIsVisible ] = useState(false)
    const [ isReady, setIsReady ] = useState(false)
    const [ isCreatorOpen, setCreatorOpen ] = useState(false)
    const [ isRoomInfoOpen, setRoomInfoOpen ] = useState(false)
    const [ isRoomLinkOpen, setRoomLinkOpen ] = useState(false)
    const [ isLoading, setIsLoading ] = useState(false)
    const [ needsInit, setNeedsInit ] = useState(true)
    const [ needsSearch, setNeedsSearch ] = useState(false)
    const { searchResult = null, topLevelContext = null, topLevelContexts = null, navigatorData = null } = useNavigator()
    const pendingSearch = useRef<{ value: string, code: string }>(null)
    const elementRef = useRef<HTMLDivElement>()

    const navigatorBanner: string = GetConfiguration<string>("illumina.navigator.banner")

    useRoomSessionManagerEvent<RoomSessionEvent>(RoomSessionEvent.CREATED, event => {
        setIsVisible(false)
        setCreatorOpen(false)
    })

    const getResultTitle = (result: any) => {
        let name = result.code
        let data = result.data
        if (!name || !name.length || LocalizeText("navigator.searchcode.title." + name) === ("navigator.searchcode.title." + name)) return data

        if (name.startsWith("${")) return name.slice(2, (name.length - 1))

        return ("navigator.searchcode.title." + name)
    }

    const sendSearch = useCallback((searchValue: string, contextCode: string) => {
        SendMessageComposer(new NavigatorSearchComposer(contextCode, searchValue))

        setIsLoading(true)
    }, [])

    const reloadCurrentSearch = useCallback(() => {
        if (!isReady) {
            setNeedsSearch(true)

            return
        }

        if (pendingSearch.current) {
            sendSearch(pendingSearch.current.value, pendingSearch.current.code)

            pendingSearch.current = null

            return
        }

        if (searchResult) {
            sendSearch(searchResult.data, searchResult.code)

            return
        }

        if (!topLevelContext) return

        sendSearch("", topLevelContext.code)
    }, [ isReady, searchResult, topLevelContext, sendSearch ])

    useEffect(() => {
        const linkTracker: ILinkEventTracker = {
            linkReceived: (url: string) => {
                const parts = url.split("/")

                if (parts.length < 2) return

                switch (parts[1]) {
                case "show": {
                    setIsVisible(true)
                    setNeedsSearch(true)
                    return
                }
                case "hide":
                    setIsVisible(false)
                    return
                case "toggle": {
                    if (isVisible) {
                        setIsVisible(false)

                        return
                    }

                    setIsVisible(true)
                    setNeedsSearch(true)
                    return
                }
                case "toggle-room-info":
                    setRoomInfoOpen(value => !value)
                    return
                case "toggle-room-link":
                    setRoomLinkOpen(value => !value)
                    return
                case "goto":
                    if (parts.length <= 2) return

                    switch (parts[2]) {
                    case "home":
                        if (navigatorData.homeRoomId <= 0) return

                        TryVisitRoom(navigatorData.homeRoomId)
                        break
                    default: {
                        const roomId = parseInt(parts[2])

                        TryVisitRoom(roomId)
                    }
                    }
                    return
                case "create":
                    setCreatorOpen(true)
                    return
                case "search":
                    if (parts.length > 2) {
                        const topLevelContextCode = parts[2]

                        let searchValue = ""

                        if (parts.length > 3) searchValue = parts[3]

                        pendingSearch.current = { value: searchValue, code: topLevelContextCode }

                        setIsVisible(true)
                        setNeedsSearch(true)
                    }
                    return
                }
            },
            eventUrlPrefix: "navigator/"
        }

        AddEventLinkTracker(linkTracker)

        return () => RemoveLinkEventTracker(linkTracker)
    }, [ isVisible, navigatorData ])

    useEffect(() => {
        if (!searchResult) return

        setIsLoading(false)

        if (elementRef && elementRef.current) elementRef.current.scrollTop = 0
    }, [ searchResult ])

    useEffect(() => {
        if (!isVisible || !isReady || !needsSearch) return

        reloadCurrentSearch()

        setNeedsSearch(false)
    }, [ isVisible, isReady, needsSearch, reloadCurrentSearch ])

    useEffect(() => {
        if (isReady || !topLevelContext) return

        setIsReady(true)
    }, [ isReady, topLevelContext ])

    useEffect(() => {
        if (!isVisible || !needsInit) return

        SendMessageComposer(new NavigatorInitComposer())

        setNeedsInit(false)
    }, [ isVisible, needsInit ])

    useEffect(() => {
        LegacyExternalInterface.addCallback(HabboWebTools.OPENROOM, (k: string, _arg_2: boolean = false, _arg_3: string = null) => SendMessageComposer(new ConvertGlobalRoomIdMessageComposer(k)))
    }, [])

    return (
        <>
            {isVisible &&
                <NitroCardView uniqueKey="navigator" windowPosition={DraggableWindowPosition.TOP_LEFT} className="illumina-navigator h-[535px] w-[425px]">
                    <NitroCardHeaderView headerText={LocalizeText("navigator.title")} onCloseClick={event => setIsVisible(false)} />
                    {isLoading && <div className="absolute left-0 top-0 z-50 size-full rounded-md bg-white/25 dark:bg-black/25" />}
                    <div className="mx-px">
                        <NitroCardTabsView className="relative max-h-[54px] min-h-[54px] border-y border-y-black bg-cover" style={{ backgroundImage: `url(${navigatorBanner})` }}>
                            {topLevelContexts && (topLevelContexts.length > 0) && topLevelContexts.map((context, index) => (
                                <NitroCardTabsItemView key={index} className="z-10" isActive={((topLevelContext === context))} onClick={event => { sendSearch("", context.code), setSelectedResult(0) }}>
                                    {LocalizeText(("navigator.toplevelview." + context.code))}
                                </NitroCardTabsItemView>
                            ))}
                            <div className="absolute left-0 top-0 size-full bg-white/30 dark:bg-[#211d19a3]" />
                        </NitroCardTabsView>
                    </div>
                    <NitroCardContentView overflow="hidden" className="relative h-full pt-1.5">
                        {LocalizeText(getResultTitle(selectedResult))}
                        <NavigatorSearchView sendSearch={sendSearch} />
                        <div ref={elementRef} className="illumina-scrollbar mb-2 h-[334px]">
                            {searchResult && searchResult.results.map((result, index) => {
                                return <NavigatorSearchResultView key={index} searchResult={result} />
                            })}
                        </div>
                        <div className="flex justify-between pr-[18px]">
                            <div className="illumina-input w-fit p-[2px] pb-[3px]">
                                <button className="relative flex h-[59px] w-[187px] items-center bg-[url('/client-assets/images/rooms/create-room.png')]" onClick={() => setCreatorOpen(true)}>
                                    <p className="absolute right-[24px] pt-[4px] text-[12.5px] font-bold leading-none text-white [text-shadow:_0_1px_0_#00000050]">{LocalizeText("navigator.create.room")}</p>
                                </button>
                            </div>
                            <div className="illumina-input pb-[3px w-fit p-[2px]">
                                <button className="relative flex h-[59px] w-[187px] items-center bg-[url('/client-assets/images/rooms/random-room.png')]" onClick={() => SendMessageComposer(new FindNewFriendsMessageComposer())}>
                                    <p className="absolute right-[24px] pt-[4px] text-[12.5px] font-bold leading-none text-white [text-shadow:_0_1px_0_#00000050]">{LocalizeText("navigator.random.room")}</p>
                                </button>
                            </div>
                        </div>
                    </NitroCardContentView>
                </NitroCardView>}
            {isCreatorOpen && <NavigatorRoomCreatorView onCloseClick={event => setCreatorOpen(false)} />}
            {isRoomInfoOpen && <NavigatorRoomInfoView onCloseClick={() => setRoomInfoOpen(false)} />}
            <NavigatorDoorStateView />
            <NavigatorRoomSettingsView />
        </>
    )
}
