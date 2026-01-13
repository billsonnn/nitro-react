import { FC } from "react"
import { attemptItemPlacement, CreateLinkEvent, LocalizeText } from "../../../../api"
import { Button, LayoutAvatarImageView, LayoutGiftTagView, LayoutImage, NitroCardContentView, NitroCardHeaderView, NitroCardView } from "../../../../common"
import { useFurniturePresentWidget, useInventoryFurni } from "../../../../hooks"

export const FurnitureGiftOpeningView: FC<{}> = props =>
{
    const { objectId = -1, text = null, isOwnerOfFurniture = false, senderName = null, senderFigure = null, placedItemId = -1, imageUrl = null, openPresent = null, onClose = null } = useFurniturePresentWidget()
    const { groupItems = [] } = useInventoryFurni()

    if(objectId === -1) return null

    const place = (itemId: number) =>
    {
        const groupItem = groupItems.find(group => (group.getItemById(itemId)?.id === itemId))

        if(groupItem) attemptItemPlacement(groupItem)

        onClose()
    }

    return (
        <NitroCardView uniqueKey="furniture-gift-opening" className="illumina-furniture-gift-opening w-[326px]">
            <NitroCardHeaderView headerText={ LocalizeText(senderName ? "widget.furni.present.window.title_from" : "widget.furni.present.window.title", [ "name" ], [ senderName ]) } onCloseClick={ onClose } />
            <NitroCardContentView>
                { (placedItemId === -1) &&
                    <>
                        <LayoutGiftTagView userName={ senderName } figure={ senderFigure } message={ text } />
                        { isOwnerOfFurniture &&
                            <div className="mt-2.5 flex flex-col items-center gap-2.5">
                                <Button variant="success" className="!px-16" onClick={ openPresent }>
                                    { LocalizeText("widget.furni.present.open_gift") }
                                </Button>
                                { senderName &&
                                    <Button onClick={ event => CreateLinkEvent("catalog/open") }>
                                        { LocalizeText("widget.furni.present.give_gift", [ "name" ], [ senderName ]) }
                                    </Button> }
                            </div> }
                    </> }
                { (placedItemId > -1) &&
                    <div className="flex flex-col">
                        <div className="mb-5 flex items-center gap-[15px] overflow-hidden px-2.5">
                            <div className="flex h-20 w-[81px] items-center justify-center bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-309px_-212px] bg-no-repeat">
                                <LayoutImage imageUrl={ imageUrl } />
                            </div>
                            <p className="text-sm">{ LocalizeText("widget.furni.present.message_opened", [ "product" ], [ text ]) }</p>
                        </div>
                        <div className="mb-2.5 flex flex-col gap-2.5 px-[50px]">
                            <Button onClick={ event => place(placedItemId) }>
                                { LocalizeText("widget.furni.present.place_in_room") }
                            </Button>
                            <Button onClick={ onClose }>
                                { LocalizeText("widget.furni.present.put_in_inventory") }
                            </Button>
                        </div>
                        { (senderName && senderName.length) && <div className="illumina-catalogue-info relative flex justify-center py-3">
                            <Button variant="success" className="relative" onClick={ event => CreateLinkEvent("catalog/open") }>
                                { LocalizeText("widget.furni.present.give_gift", [ "name" ], [ senderName ]) }
                                <LayoutAvatarImageView className="!absolute -right-10 top-[-50px] !bg-[center_6px]" figure={ senderFigure } direction={ 2 } headOnly={ true } />
                            </Button>
                        </div> }
                    </div> }
            </NitroCardContentView>
        </NitroCardView>
    )
}
