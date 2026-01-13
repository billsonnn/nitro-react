import { RoomObjectCategory } from "@nitrots/nitro-renderer"
import { FC, useEffect, useMemo, useState } from "react"
import { GetRoomEngine, IsOwnerOfFurniture, LocalizeText } from "../../../../api"
import { Button, LayoutGridItem, NitroBigCardContentView, NitroBigCardHeaderView, NitroBigCardView } from "../../../../common"
import { LayoutTimesView } from "../../../../common/layout/LayoutTimesView"
import { useFurnitureCraftingWidget, useRoom } from "../../../../hooks"

export const FurnitureCraftingView: FC<{}> = props =>
{
    const { objectId = -1, recipes = [], ingredients = [], selectedRecipe = null, requiredIngredients = null, isCrafting = false, craft = null, selectRecipe = null, onClose = null } = useFurnitureCraftingWidget()
    const { roomSession = null } = useRoom()
    const [ waitingToConfirm, setWaitingToConfirm ] = useState(false)

    const isOwner = useMemo(() =>
    {
        const roomObject = GetRoomEngine().getRoomObject(roomSession.roomId, objectId, RoomObjectCategory.FLOOR)
        return IsOwnerOfFurniture(roomObject)
    }, [ objectId, roomSession.roomId ])

    const canCraft = useMemo(() =>
    {
        if(!requiredIngredients || !requiredIngredients.length) return false

        for (const ingredient of requiredIngredients) 
        {
            const ingredientData = ingredients.find(data => (data.name === ingredient.itemName))

            if (!ingredientData || ingredientData.count < ingredient.count) return false
        }

        return true
    }, [ ingredients, requiredIngredients ])

    const tryCraft = () =>
    {
        if (!waitingToConfirm) 
        {
            setWaitingToConfirm(true)

            return
        }

        craft()
        setWaitingToConfirm(false)
    }

    useEffect(() =>
    {
        setWaitingToConfirm(false)
    }, [ selectedRecipe ])

    if(objectId === -1) return null

    return (
        <NitroBigCardView uniqueKey="crafting" className="illumina-crafting w-[541px]">
            <NitroBigCardHeaderView headerText={ LocalizeText("crafting.title") } />
            <NitroBigCardContentView>
                <div className="mb-1 flex w-full justify-end">
                    <LayoutTimesView onClick={ onClose } />
                </div>
                <div className="relative bg-[url('/client-assets/images/crafting/bg.png?v=2451779')] w-[521px] h-[352px]">
                    <div className="absolute left-[17px] top-[19px]">
                        <p className="h-[30px] w-[221px] place-content-center text-center text-sm font-semibold text-[#CFC6B3] [text-shadow:_0_1px_0_#7F6455]">
                            { LocalizeText("crafting.title.products") }
                        </p>
                        <div>
                            { (recipes.length > 0) && recipes.map((item) => <LayoutGridItem key={ item.name } itemImage={ item.iconUrl } itemActive={ selectedRecipe && selectedRecipe.name === item.name } onClick={ () => selectRecipe(item) } />) }
                        </div>
                    </div>
                    <div className="absolute left-[17px] top-[187px]">
                        <p className="h-[30px] w-[221px] place-content-center text-center text-sm font-semibold text-[#CFC6B3] [text-shadow:_0_1px_0_#7F6455]">
                            { LocalizeText("crafting.title.mixer") }
                        </p>
                        <div>
                            { (ingredients.length > 0) && ingredients.map((item) => <LayoutGridItem key={ item.name } itemImage={ item.iconUrl } itemCount={ item.count } itemCountMinimum={ 0 } className={ (!item.count ? "opacity-0-5 " : "") + "cursor-default" } />) }
                        </div>
                    </div>
                    <div className="absolute bottom-[53px] right-[19px] h-[137px] w-[215px] p-3">
                        { !selectedRecipe && <p className="text-xs text-[#7E8586]">{ LocalizeText("crafting.info.start") }</p> }
                    </div>
                    <div className="absolute bottom-[13px] right-[19px]">
                        { selectedRecipe && <Button variant="success" className="w-[216px]" disabled={ !isOwner || !canCraft || isCrafting } onClick={ tryCraft }>
                            { !isCrafting && LocalizeText(!isOwner ? "crafting.btn.notowner" : !canCraft ? "crafting.status.recipe.incomplete" : waitingToConfirm ? "generic.confirm" : "crafting.btn.craft") }
                        </Button> }
                    </div>
                </div>
            </NitroBigCardContentView>
        </NitroBigCardView>
    )
}
