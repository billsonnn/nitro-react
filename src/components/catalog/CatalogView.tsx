import { ILinkEventTracker } from "@nitrots/nitro-renderer"
import { FC, useEffect } from "react"
import { AddEventLinkTracker, GetConfiguration, LocalizeText, RemoveLinkEventTracker } from "../../api"
import { DraggableWindowPosition, NitroCardContentView, NitroCardHeaderView, NitroCardTabsItemView, NitroCardTabsView, NitroCardView } from "../../common"
import { useCatalog } from "../../hooks"
import { CatalogIconView } from "./views/catalog-icon/CatalogIconView"
import { CatalogGiftView } from "./views/gift/CatalogGiftView"
import { CatalogNavigationView } from "./views/navigation/CatalogNavigationView"
import { GetCatalogLayout } from "./views/page/layout/GetCatalogLayout"
import { MarketplacePostOfferView } from "./views/page/layout/marketplace/MarketplacePostOfferView"

export const CatalogView: FC<{}> = props => {
    const { isVisible = false, setIsVisible = null, rootNode = null, currentPage = null, navigationHidden = false, setNavigationHidden = null, activeNodes = [], searchResult = null, setSearchResult = null, openPageByName = null, openPageByOfferId = null, activateNode = null, getNodeById } = useCatalog()

    useEffect(() => {
        const linkTracker: ILinkEventTracker = {
            linkReceived: (url: string) => {
                const parts = url.split("/")

                if (parts.length < 2) return

                switch (parts[1]) {
                    case "show":
                        setIsVisible(true)
                        return
                    case "hide":
                        setIsVisible(false)
                        return
                    case "toggle":
                        setIsVisible(prevValue => !prevValue)
                        return
                    case "open":
                        if (parts.length > 2) {
                            if (parts.length === 4) {
                                switch (parts[2]) {
                                    case "offerId":
                                        openPageByOfferId(parseInt(parts[3]))
                                        return
                                }
                            }
                            else {
                                openPageByName(parts[2])
                            }
                        }
                        else {
                            setIsVisible(true)
                        }

                        return
                }
            },
            eventUrlPrefix: "catalog/"
        }

        AddEventLinkTracker(linkTracker)

        return () => RemoveLinkEventTracker(linkTracker)
    }, [setIsVisible, openPageByOfferId, openPageByName])

    return (
        <>
            {isVisible &&
                <NitroCardView uniqueKey="catalog" windowPosition={DraggableWindowPosition.TOP_LEFT} className="illumina-catalog h-[560px] w-[620px]">
                    <NitroCardHeaderView headerText={LocalizeText("catalog.title")} onCloseClick={event => setIsVisible(false)} />
                    <NitroCardContentView overflow="hidden" className="h-full">
                        <div className="flex h-full">
                            {!navigationHidden &&
                                <div className="flex h-full min-w-[185px] max-w-[185px] flex-col gap-2.5">
                                    {activeNodes && (activeNodes.length > 0) &&
                                        <CatalogNavigationView node={activeNodes[0]} />}
                                </div>}
                            <div className="flex w-full flex-col">
                                <NitroCardTabsView>
                                    {rootNode && (rootNode.children.length > 0) && rootNode.children.map(child => {
                                        if (!child.isVisible) return null

                                        return (
                                            <NitroCardTabsItemView key={child.pageId} className="w-full" isActive={child.isActive} onClick={event => {
                                                if (searchResult) setSearchResult(null)

                                                activateNode(child)
                                            }} >
                                                <div className="flex items-center gap-[11px] whitespace-nowrap overflow-hidden">
                                                    {GetConfiguration("catalog.tab.icons") && <CatalogIconView icon={child.iconId} />}
                                                    {child.localization}
                                                </div>
                                            </NitroCardTabsItemView>
                                        )
                                    })}
                                </NitroCardTabsView>
                                <div className="size-full flex-1 p-[9px] pl-[51px]">
                                    <div className="flex h-full w-[360px] flex-col">
                                        {GetCatalogLayout(currentPage, () => setNavigationHidden(true))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </NitroCardContentView>
                </NitroCardView>}
            <CatalogGiftView />
            <MarketplacePostOfferView />
        </>
    )
}