import { RedeemItemClothingComposer, RoomObjectCategory, UserFigureComposer } from "@nitrots/nitro-renderer"
import { FC, useEffect, useState } from "react"
import { FigureData, FurniCategory, GetAvatarRenderManager, GetConnection, GetFurnitureDataForRoomObject, GetSessionDataManager, LocalizeText } from "../../../../../api"
import { Button, LayoutAvatarImageView, NitroCardContentView, NitroCardHeaderView, NitroCardView } from "../../../../../common"
import { useRoom } from "../../../../../hooks"

interface PurchasableClothingConfirmViewProps
{
    objectId: number;
    onClose: () => void;
}

const MODE_DEFAULT: number = -1
const MODE_PURCHASABLE_CLOTHING: number = 0

export const PurchasableClothingConfirmView: FC<PurchasableClothingConfirmViewProps> = props =>
{
    const { objectId = -1, onClose = null } = props
    const [ mode, setMode ] = useState(MODE_DEFAULT)
    const [ gender, setGender ] = useState<string>(FigureData.MALE)
    const [ newFigure, setNewFigure ] = useState<string>(null)
    const { roomSession = null } = useRoom()

    const useProduct = () =>
    {
        GetConnection().send(new RedeemItemClothingComposer(objectId))
        GetConnection().send(new UserFigureComposer(gender, newFigure))

        onClose()
    }

    useEffect(() =>
    {
        let mode = MODE_DEFAULT

        const figure = GetSessionDataManager().figure
        const gender = GetSessionDataManager().gender
        const validSets: number[] = []

        if(roomSession && (objectId >= 0))
        {
            const furniData = GetFurnitureDataForRoomObject(roomSession.roomId, objectId, RoomObjectCategory.FLOOR)

            if(furniData)
            {
                switch(furniData.specialType)
                {
                case FurniCategory.FIGURE_PURCHASABLE_SET:
                    mode = MODE_PURCHASABLE_CLOTHING

                    const setIds = furniData.customParams.split(",").map(part => parseInt(part))

                    for(const setId of setIds)
                    {
                        if(GetAvatarRenderManager().isValidFigureSetForGender(setId, gender)) validSets.push(setId)
                    }

                    break
                }
            }
        }

        if(mode === MODE_DEFAULT)
        {
            onClose()

            return
        }
        
        setGender(gender)
        setNewFigure(GetAvatarRenderManager().getFigureStringWithFigureIds(figure, gender, validSets))

        // if owns clothing, change to it

        setMode(mode)
    }, [ roomSession, objectId, onClose ])

    if(mode === MODE_DEFAULT) return null
    
    return (
        <NitroCardView uniqueKey="use-purchasable-clothing-confirm" className="illumina-purchasable-clothing-confirm w-[350px]">
            <NitroCardHeaderView headerText={ LocalizeText("useproduct.widget.title.bind_clothing") } onCloseClick={ onClose } />
            <NitroCardContentView center>
                <div className="flex h-full">
                    <div className="flex w-[137px] items-center">
                        <LayoutAvatarImageView figure={ newFigure } direction={ 2 } />
                    </div>
                    <div className="flex h-auto flex-col">
                        <div className="flex flex-1 flex-col gap-[5px]">
                            <p className="text-sm">{ LocalizeText("useproduct.widget.text.bind_clothing") }</p>
                            <p className="text-sm italic">{ LocalizeText("useproduct.widget.info.bind_clothing") }</p>
                        </div>
                        <div className="flex items-center justify-between">
                            <Button variant="underline" onClick={ onClose }>{ LocalizeText("useproduct.widget.cancel") }</Button>
                            <Button variant="primary" onClick={ useProduct }>{ LocalizeText("useproduct.widget.bind_clothing") }</Button>
                        </div>
                    </div>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    )
}
