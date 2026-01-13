import { Vector3d } from "@nitrots/nitro-renderer"
import { FC, useEffect } from "react"
import { FurniCategory, GetSessionDataManager, ICatalogPage, Offer, ProductTypeEnum } from "../../../../../api"
import { LayoutGridItem, LayoutImage, LayoutRoomPreviewerView } from "../../../../../common"
import { useCatalog } from "../../../../../hooks"

export interface CatalogViewProductWidgetViewProps
{
    page?: ICatalogPage;
    height?: number;
    isRoom?: boolean;
    isBackground?: boolean;
}

export const CatalogViewProductWidgetView: FC<CatalogViewProductWidgetViewProps> = props =>
{
    const { currentOffer = null, roomPreviewer = null, purchaseOptions = null } = useCatalog()
    const { previewStuffData = null } = purchaseOptions
    const { page = null, height = 240, isRoom = false, isBackground = true } = props

    useEffect(() => {
        setTimeout(() => {
            { isRoom
                ? roomPreviewer.updateRoomWallsAndFloorVisibility(true, true) 
                : roomPreviewer.updateRoomWallsAndFloorVisibility(false, false)}
        }, 30)
    }, [ roomPreviewer, isRoom ])

    useEffect(() =>
    {
        if(!(currentOffer && roomPreviewer) || (currentOffer.pricingModel === Offer.PRICING_MODEL_BUNDLE)) return

        const product = currentOffer.product

        if(!product) return

        roomPreviewer.reset(true)

        switch(product.productType)
        {
        case ProductTypeEnum.FLOOR: {
            if(!product.furnitureData) return
            
            roomPreviewer.addFurnitureIntoRoom(product.productClassId, new Vector3d(90), previewStuffData, product.extraParam)
            return
        }
        case ProductTypeEnum.WALL: {
            if(!product.furnitureData) return

            switch(product.furnitureData.specialType)
            {
            case FurniCategory.FLOOR:
                roomPreviewer.updateObjectRoom(product.extraParam)
                return
            case FurniCategory.WALL_PAPER:
                roomPreviewer.updateObjectRoom(null, product.extraParam)
                return
            case FurniCategory.LANDSCAPE: {
                roomPreviewer.updateObjectRoom(null, null, product.extraParam)

                const furniData = GetSessionDataManager().getWallItemDataByName("window_double_default")

                if(furniData) roomPreviewer.addWallItemIntoRoom(furniData.id, new Vector3d(90), furniData.customParams)
                return
            }
            default:
                roomPreviewer.updateObjectRoom("default", "default", "default")
                roomPreviewer.addWallItemIntoRoom(product.productClassId, new Vector3d(90), product.extraParam)
                return
            }
        }
        case ProductTypeEnum.ROBOT:
            roomPreviewer.addAvatarIntoRoom(product.extraParam, 0)
            return
        case ProductTypeEnum.EFFECT:
            roomPreviewer.addAvatarIntoRoom(GetSessionDataManager().figure, product.productClassId)
            return
        }
    }, [ currentOffer, previewStuffData, purchaseOptions, roomPreviewer, isRoom ])

    if(!currentOffer) return null

    if(currentOffer.pricingModel === Offer.PRICING_MODEL_BUNDLE)
    {
        return (
            <div className="flex w-full justify-between">
                <div className="illumina-scrollbar mt-[85px] grid h-[85px] max-h-[85px] w-[150px] grid-cols-3 pt-[5px]">
                    { (currentOffer.products.length > 0) && currentOffer.products.map((product, index) => {
                        return <LayoutGridItem key={ index } className="!h-10 w-10 !p-0" itemBundle={ true } itemImage={ product.getIconUrl(currentOffer) } itemCount={ product.productCount } />
                    })}
                </div>
                { !!page.localization.getImage(1) && 
                    <LayoutImage imageUrl={ page.localization.getImage(1) } /> }
            </div>
        )
    }
    
    return <LayoutRoomPreviewerView roomPreviewer={ roomPreviewer } height={ height } isBackground={ isBackground } />
}
