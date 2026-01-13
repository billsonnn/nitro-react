import { GetMarketplaceConfigurationMessageComposer, MakeOfferMessageComposer, MarketplaceConfigurationEvent } from "@nitrots/nitro-renderer"
import { FC, useEffect, useState } from "react"
import { FurnitureItem, LocalizeText, ProductTypeEnum, SendMessageComposer } from "../../../../../../api"
import { Button, LayoutFurniImageView, NitroCardContentView, NitroCardHeaderView, NitroCardView } from "../../../../../../common"
import { CatalogPostMarketplaceOfferEvent } from "../../../../../../events"
import { useCatalog, useMessageEvent, useNotification, useUiEvent } from "../../../../../../hooks"

export const MarketplacePostOfferView : FC<{}> = props =>
{
    const [ item, setItem ] = useState<FurnitureItem>(null)
    const [ askingPrice, setAskingPrice ] = useState(0)
    const [ tempAskingPrice, setTempAskingPrice ] = useState("0")
    const { catalogOptions = null, setCatalogOptions = null } = useCatalog()
    const { marketplaceConfiguration = null } = catalogOptions
    const { showConfirm = null } = useNotification()

    const updateAskingPrice = (price: string) =>
    {
        setTempAskingPrice(price)

        const newValue = parseInt(price)

        if(isNaN(newValue) || (newValue === askingPrice)) return

        setAskingPrice(parseInt(price))
    }

    useMessageEvent<MarketplaceConfigurationEvent>(MarketplaceConfigurationEvent, event =>
    {
        const parser = event.getParser()

        setCatalogOptions(prevValue =>
        {
            const newValue = { ...prevValue }

            newValue.marketplaceConfiguration = parser

            return newValue
        })
    })

    useUiEvent<CatalogPostMarketplaceOfferEvent>(CatalogPostMarketplaceOfferEvent.POST_MARKETPLACE, event => setItem(event.item))

    useEffect(() =>
    {
        if(!item || marketplaceConfiguration) return

        SendMessageComposer(new GetMarketplaceConfigurationMessageComposer())
    }, [ item, marketplaceConfiguration ])

    useEffect(() =>
    {
        if(!item) return
        
        return () => setAskingPrice(0)
    }, [ item ])

    if(!marketplaceConfiguration || !item) return null

    const getFurniTitle = (item ? LocalizeText(item.isWallItem ? "wallItem.name." + item.type : "roomItem.name." + item.type) : "")
    const getFurniDescription = (item ? LocalizeText(item.isWallItem ? "wallItem.desc." + item.type : "roomItem.desc." + item.type) : "")

    const getCommission = () => Math.max(Math.ceil(((marketplaceConfiguration.commission * 0.01) * askingPrice)), 1)

    const postItem = () =>
    {
        if(!item || (askingPrice < marketplaceConfiguration.minimumPrice)) return

        showConfirm(LocalizeText("inventory.marketplace.confirm_offer.info", [ "furniname", "price" ], [ getFurniTitle, askingPrice.toString() ]), () =>
        {
            SendMessageComposer(new MakeOfferMessageComposer(askingPrice, item.isWallItem ? 2 : 1, item.id))
            setItem(null)
        },
        () => 
        {
            setItem(null) 
        }, null, null, LocalizeText("inventory.marketplace.confirm_offer.title"))
    }
    
    return (
        <NitroCardView uniqueKey="marketplace-post-offer" className="illumina-marketplace-post-offer w-[300px]">
            <NitroCardHeaderView headerText={ LocalizeText("inventory.marketplace.make_offer.title") } onCloseClick={ event => setItem(null) } />
            <NitroCardContentView>
                <div className="flex flex-col">
                    <div className="mb-[9px] flex gap-2.5">
                        <div className="illumina-previewer relative flex h-[152px] w-[126px] shrink-0 items-center justify-center overflow-hidden p-[3px]">
                            <LayoutFurniImageView productType={ item.isWallItem ? ProductTypeEnum.WALL : ProductTypeEnum.FLOOR } productClassId={ item.type } extraData={ item.extra.toString() } />
                        </div>
                        <div className="flex">
                            <p className="text-base font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ getFurniTitle }</p>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <p className="text-sm">{ LocalizeText("inventory.marketplace.make_offer.expiration_info", [ "time" ], [ marketplaceConfiguration.offerTime.toString() ]) }</p>
                        <div className="mb-3 mt-[18px] flex items-center justify-end gap-[5px]">
                            <p className="text-sm font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("inventory.marketplace.make_offer.price_request") }</p>
                            <input className="illumina-input h-[26px] w-[66px] bg-transparent px-[11px] text-[13px] text-black" type="number" min={ 0 } value={ tempAskingPrice } onChange={ event => updateAskingPrice(event.target.value) } />
                        </div>
                        <div className="illumina-card-item mb-1.5 px-2 py-[5px] text-sm">
                            { ((askingPrice <= 0) || isNaN(askingPrice)) &&
                                    <p className="text-sm">
                                        { LocalizeText("inventory.marketplace.make_offer.min_price", [ "minprice" ], [ marketplaceConfiguration.minimumPrice.toString() ]) }
                                    </p> }
                            { ((askingPrice > marketplaceConfiguration.maximumPrice) && !isNaN(askingPrice)) &&
                                    <p className="text-sm">
                                        { LocalizeText("inventory.marketplace.make_offer.max_price", [ "maxprice" ], [ marketplaceConfiguration.maximumPrice.toString() ]) }
                                    </p> }
                            { (!((askingPrice < marketplaceConfiguration.minimumPrice) || (askingPrice > marketplaceConfiguration.maximumPrice) || isNaN(askingPrice))) &&
                                    <p className="text-sm">
                                        { LocalizeText("inventory.marketplace.make_offer.final_price", [ "commission", "finalprice" ], [ getCommission().toString(), (askingPrice + getCommission()).toString() ]) }
                                    </p> }
                        </div>
                        <div className="flex items-center justify-between">
                            <Button variant="primary" disabled={ ((askingPrice < marketplaceConfiguration.minimumPrice) || (askingPrice > marketplaceConfiguration.maximumPrice) || isNaN(askingPrice)) } onClick={ postItem }>
                                { LocalizeText("inventory.marketplace.make_offer.post") }
                            </Button>
                            <Button variant="primary" onClick={ event => setItem(null) }>
                                { LocalizeText("generic.cancel") }
                            </Button>
                        </div>
                    </div>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    )
}
