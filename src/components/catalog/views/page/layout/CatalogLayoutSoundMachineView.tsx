import { GetOfficialSongIdMessageComposer, MusicPriorities, OfficialSongIdMessageEvent } from "@nitrots/nitro-renderer"
import { FC, useEffect, useState } from "react"
import { GetNitroInstance, LocalizeText, ProductTypeEnum, SendMessageComposer } from "../../../../../api"
import { Button, LayoutImage } from "../../../../../common"
import { useCatalog, useMessageEvent } from "../../../../../hooks"
import { CatalogAddOnBadgeWidgetView } from "../widgets/CatalogAddOnBadgeWidgetView"
import { CatalogItemGridWidgetView } from "../widgets/CatalogItemGridWidgetView"
import { CatalogLimitedItemWidgetView } from "../widgets/CatalogLimitedItemWidgetView"
import { CatalogPurchaseWidgetView } from "../widgets/CatalogPurchaseWidgetView"
import { CatalogSimplePriceWidgetView } from "../widgets/CatalogSimplePriceWidgetView"
import { CatalogViewProductWidgetView } from "../widgets/CatalogViewProductWidgetView"
import { CatalogLayoutProps } from "./CatalogLayout.types"

export const CatalogLayoutSoundMachineView: FC<CatalogLayoutProps> = props =>
{
    const { page = null } = props
    const [ songId, setSongId ] = useState(-1)
    const [ officialSongId, setOfficialSongId ] = useState("")
    const { currentOffer = null, currentPage = null } = useCatalog()

    const previewSong = (previewSongId: number) => GetNitroInstance().soundManager.musicController?.playSong(previewSongId, MusicPriorities.PRIORITY_PURCHASE_PREVIEW, 15, 0, 0, 0)

    useMessageEvent<OfficialSongIdMessageEvent>(OfficialSongIdMessageEvent, event =>
    {
        const parser = event.getParser()

        if(parser.officialSongId !== officialSongId) return

        setSongId(parser.songId)
    })

    useEffect(() =>
    {
        if(!currentOffer) return

        const product = currentOffer.product

        if(!product) return

        if(product.extraParam.length > 0)
        {
            const id = parseInt(product.extraParam)

            if(id > 0)
            {
                setSongId(id)
            }
            else
            {
                setOfficialSongId(product.extraParam)
                SendMessageComposer(new GetOfficialSongIdMessageComposer(product.extraParam))
            }
        }
        else
        {
            setOfficialSongId("")
            setSongId(-1)
        }

        return () => GetNitroInstance().soundManager.musicController?.stop(MusicPriorities.PRIORITY_PURCHASE_PREVIEW)
    }, [ currentOffer ])

    useEffect(() =>
    {
        return () => GetNitroInstance().soundManager.musicController?.stop(MusicPriorities.PRIORITY_PURCHASE_PREVIEW)
    }, [])

    return (
        <div className="flex h-full flex-col">
            <div className="flex-1">
                <div className="relative h-[255px]">
                    { !currentOffer &&
                        <div className="flex h-full flex-col items-center justify-center">
                            { !!page.localization.getImage(1) && 
                                <LayoutImage imageUrl={ page.localization.getImage(1) } /> }
                        </div> }
                    { currentOffer && 
                        <div className="relative h-[246px]">
                            { (currentOffer.product.productType !== ProductTypeEnum.BADGE) && <>
                                <CatalogViewProductWidgetView />
                                <CatalogAddOnBadgeWidgetView className="absolute right-1.5 top-1.5 " />
                                <CatalogLimitedItemWidgetView />
                                <p className="absolute left-1.5 top-1.5 text-sm font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ currentOffer.localizationName }</p>
                                <CatalogSimplePriceWidgetView className="absolute bottom-1.5 right-1.5 !px-0" />
                                { songId > -1 &&
                                    <div className="illumina-catalogue-track-preview absolute bottom-1.5 left-1.5 flex items-center gap-[33px] px-[7px] py-2">
                                        <p className="pl-[5px] text-[11px]">{ LocalizeText("play_preview") }</p>
                                        <Button onClick={ () => previewSong(songId) }>{ LocalizeText("play_preview_button") }</Button>
                                    </div> }
                            </> }
                        </div> }
                </div>
                <div className="illumina-card h-[170px] w-full overflow-hidden p-1">
                    <CatalogItemGridWidgetView />
                </div>
            </div>
            <div className="mt-2 flex flex-col">
                <CatalogPurchaseWidgetView />
            </div>
        </div>
    )
}
