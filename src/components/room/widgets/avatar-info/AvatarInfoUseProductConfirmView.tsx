import { IFurnitureData, IPetCustomPart, IRoomUserData, PetCustomPart, PetFigureData, RoomObjectCategory, RoomObjectVariable } from "@nitrots/nitro-renderer"
import { FC, useEffect, useMemo, useState } from "react"
import { FurniCategory, GetFurnitureDataForRoomObject, GetRoomEngine, LocalizeText, UseProductItem } from "../../../../api"
import { Button, LayoutPetImageView, NitroCardContentView, NitroCardHeaderView, NitroCardView } from "../../../../common"
import { useRoom } from "../../../../hooks"

interface AvatarInfoUseProductConfirmViewProps
{
    item: UseProductItem;
    onClose: () => void;
}

const PRODUCT_PAGE_UKNOWN: number = -1
const PRODUCT_PAGE_SHAMPOO: number = 0
const PRODUCT_PAGE_CUSTOM_PART: number = 1
const PRODUCT_PAGE_CUSTOM_PART_SHAMPOO: number = 2
const PRODUCT_PAGE_SADDLE: number = 3
const PRODUCT_PAGE_REVIVE: number = 4
const PRODUCT_PAGE_REBREED: number = 5
const PRODUCT_PAGE_FERTILIZE: number = 6

export const AvatarInfoUseProductConfirmView: FC<AvatarInfoUseProductConfirmViewProps> = props =>
{
    const { item = null, onClose = null } = props
    const [ mode, setMode ] = useState(PRODUCT_PAGE_UKNOWN)
    const [ petData, setPetData ] = useState<IRoomUserData>(null)
    const [ furniData, setFurniData ] = useState<IFurnitureData>(null)
    const { roomSession = null } = useRoom()

    const selectRoomObject = () =>
    {
        if(!petData) return

        GetRoomEngine().selectRoomObject(roomSession.roomId, petData.roomIndex, RoomObjectCategory.UNIT)
    }

    const useProduct = () =>
    {
        roomSession.usePetProduct(item.requestRoomObjectId, petData.webID)

        onClose()
    }

    const getPetImage = useMemo(() =>
    {
        if(!petData || !furniData) return null

        const petFigureData = new PetFigureData(petData.figure)
        const customParts = furniData.customParams.split(" ")
        const petIndex = parseInt(customParts[0])

        switch(furniData.specialType)
        {
        case FurniCategory.PET_SHAMPOO: {
            if(customParts.length < 2) return null

            const currentPalette = GetRoomEngine().getPetColorResult(petIndex, petFigureData.paletteId)
            const possiblePalettes = GetRoomEngine().getPetColorResultsForTag(petIndex, customParts[1])

            let paletteId = -1

            for(const result of possiblePalettes)
            {
                if(result.breed === currentPalette.breed)
                {
                    paletteId = parseInt(result.id)

                    break
                }
            }

            return <LayoutPetImageView typeId={ petFigureData.typeId } paletteId={ paletteId } petColor={ petFigureData.color } customParts={ petFigureData.customParts } direction={ 2 } />
        }
        case FurniCategory.PET_CUSTOM_PART: {
            if(customParts.length < 4) return null

            const newCustomParts: IPetCustomPart[] = []

            const _local_6 = customParts[1].split(",").map(piece => parseInt(piece))
            const _local_7 = customParts[2].split(",").map(piece => parseInt(piece))
            const _local_8 = customParts[3].split(",").map(piece => parseInt(piece))

            let _local_10 = 0

            while(_local_10 < _local_6.length)
            {
                const _local_13 = _local_6[_local_10]
                const _local_15 = petFigureData.getCustomPart(_local_13)

                let _local_12 = _local_8[_local_10]

                if(_local_15 !== null) _local_12 = _local_15.paletteId

                newCustomParts.push(new PetCustomPart(_local_13, _local_7[_local_10], _local_12))

                _local_10++
            }

            return <LayoutPetImageView typeId={ petFigureData.typeId } paletteId={ petFigureData.paletteId } petColor={ petFigureData.color } customParts={ newCustomParts } direction={ 2 } />
        }
        case FurniCategory.PET_CUSTOM_PART_SHAMPOO: {
            if(customParts.length < 3) return null

            const newCustomParts: IPetCustomPart[] = []

            const _local_6 = customParts[1].split(",").map(piece => parseInt(piece))
            const _local_8 = customParts[2].split(",").map(piece => parseInt(piece))

            let _local_10 = 0

            while(_local_10 < _local_6.length)
            {
                const _local_13 = _local_6[_local_10]
                const _local_15 = petFigureData.getCustomPart(_local_13)

                let _local_14 = -1

                if(_local_15 !== null) _local_14 = _local_15.partId

                newCustomParts.push(new PetCustomPart(_local_6[_local_10], _local_14, _local_8[_local_10]))

                _local_10++
            }

            return <LayoutPetImageView typeId={ petFigureData.typeId } paletteId={ petFigureData.paletteId } petColor={ petFigureData.color } customParts={ newCustomParts } direction={ 2 } />
        }
        case FurniCategory.PET_SADDLE: {
            if(customParts.length < 4) return null

            const newCustomParts: IPetCustomPart[] = []

            const _local_6 = customParts[1].split(",").map(piece => parseInt(piece))
            const _local_7 = customParts[2].split(",").map(piece => parseInt(piece))
            const _local_8 = customParts[3].split(",").map(piece => parseInt(piece))

            let _local_10 = 0

            while(_local_10 < _local_6.length)
            {
                newCustomParts.push(new PetCustomPart(_local_6[_local_10], _local_7[_local_10], _local_8[_local_10]))

                _local_10++
            }

            for(const _local_21 of petFigureData.customParts)
            {
                if(_local_6.indexOf(_local_21.layerId) === -1)
                {
                    newCustomParts.push(_local_21)
                }
            }

            return <LayoutPetImageView typeId={ petFigureData.typeId } paletteId={ petFigureData.paletteId } petColor={ petFigureData.color } customParts={ newCustomParts } direction={ 2 } />
        }
        case FurniCategory.MONSTERPLANT_REBREED:
        case FurniCategory.MONSTERPLANT_REVIVAL:
        case FurniCategory.MONSTERPLANT_FERTILIZE: {
            let posture = "rip"

            const roomObject = GetRoomEngine().getRoomObject(roomSession.roomId, petData.roomIndex, RoomObjectCategory.UNIT)

            if(roomObject)
            {
                posture = roomObject.model.getValue<string>(RoomObjectVariable.FIGURE_POSTURE)

                if(posture === "rip")
                {
                    const level = petData.petLevel

                    if(level < 7) posture = `grw${ level }`
                    else posture = "std"
                }
            }

            return <LayoutPetImageView typeId={ petFigureData.typeId } paletteId={ petFigureData.paletteId } petColor={ petFigureData.color } customParts={ petFigureData.customParts } posture={ posture } direction={ 2 } />
        }
        }
    }, [ petData, furniData, roomSession ])

    useEffect(() =>
    {
        const userData = roomSession.userDataManager.getUserDataByIndex(item.id)

        setPetData(userData)

        const furniData = GetFurnitureDataForRoomObject(roomSession.roomId, item.requestRoomObjectId, RoomObjectCategory.FLOOR)

        if(!furniData) return

        setFurniData(furniData)

        let mode = PRODUCT_PAGE_UKNOWN

        switch(furniData.specialType)
        {
        case FurniCategory.PET_SHAMPOO:
            mode = PRODUCT_PAGE_SHAMPOO
            break
        case FurniCategory.PET_CUSTOM_PART:
            mode = PRODUCT_PAGE_CUSTOM_PART
            break
        case FurniCategory.PET_CUSTOM_PART_SHAMPOO:
            mode = PRODUCT_PAGE_CUSTOM_PART_SHAMPOO
            break
        case FurniCategory.PET_SADDLE:
            mode = PRODUCT_PAGE_SADDLE
            break
        case FurniCategory.MONSTERPLANT_REVIVAL:
            mode = PRODUCT_PAGE_REVIVE
            break
        case FurniCategory.MONSTERPLANT_REBREED:
            mode = PRODUCT_PAGE_REBREED
            break
        case FurniCategory.MONSTERPLANT_FERTILIZE:
            mode = PRODUCT_PAGE_FERTILIZE
            break
        }

        setMode(mode)
    }, [ roomSession, item ])

    if(!petData) return null

    return (
        <NitroCardView uniqueKey="use-product-confirm" className="illumina-use-product-confirm w-[350px]">
            <NitroCardHeaderView headerText={ LocalizeText("useproduct.widget.title", [ "name" ], [ petData.name ]) } onCloseClick={ onClose } />
            <NitroCardContentView center>
                <div className="flex">
                    <div className="flex h-[130px] w-[122px] shrink-0 items-center justify-center bg-[url('/client-assets/images/room-widgets/furni-context/preview-bg.png?v=2451779')]">
                        { getPetImage }
                    </div>
                    <div className="flex flex-col p-2.5 pb-[5px]">
                        <div className="flex-1">
                            { (mode === PRODUCT_PAGE_SHAMPOO) &&
                                <>
                                    <p className="mb-[15px] text-sm">{ LocalizeText("useproduct.widget.text.shampoo", [ "productName" ], [ furniData.name ]) }</p>
                                    <p className="text-sm italic">{ LocalizeText("useproduct.widget.info.shampoo") }</p>
                                </> }
                            { (mode === PRODUCT_PAGE_CUSTOM_PART) &&
                                <>
                                    <p className="mb-[15px] text-sm">{ LocalizeText("useproduct.widget.text.custompart", [ "productName" ], [ furniData.name ]) }</p>
                                    <p className="text-sm italic">{ LocalizeText("useproduct.widget.info.custompart") }</p>
                                </> }
                            { (mode === PRODUCT_PAGE_CUSTOM_PART_SHAMPOO) &&
                                <>
                                    <p className="mb-[15px] text-sm">{ LocalizeText("useproduct.widget.text.custompartshampoo", [ "productName" ], [ furniData.name ]) }</p>
                                    <p className="text-sm italic">{ LocalizeText("useproduct.widget.info.custompartshampoo") }</p>
                                </> }
                            { (mode === PRODUCT_PAGE_SADDLE) &&
                                <>
                                    <p className="mb-[15px] text-sm">{ LocalizeText("useproduct.widget.text.saddle", [ "productName" ], [ furniData.name ]) }</p>
                                    <p className="text-sm italic">{ LocalizeText("useproduct.widget.info.saddle") }</p>
                                </> }
                            { (mode === PRODUCT_PAGE_REVIVE) &&
                                <>
                                    <p className="mb-[15px] text-sm">{ LocalizeText("useproduct.widget.text.revive_monsterplant", [ "productName" ], [ furniData.name ]) }</p>
                                    <p className="text-sm italic">{ LocalizeText("useproduct.widget.info.revive_monsterplant") }</p>
                                </> }
                            { (mode === PRODUCT_PAGE_REBREED) &&
                                <>
                                    <p className="mb-[15px] text-sm">{ LocalizeText("useproduct.widget.text.rebreed_monsterplant", [ "productName" ], [ furniData.name ]) }</p>
                                    <p className="text-sm italic">{ LocalizeText("useproduct.widget.info.rebreed_monsterplant") }</p>
                                </> }
                            { (mode === PRODUCT_PAGE_FERTILIZE) &&
                                <>
                                    <p className="mb-[15px] text-sm">{ LocalizeText("useproduct.widget.text.fertilize_monsterplant", [ "productName" ], [ furniData.name ]) }</p>
                                    <p className="text-sm italic">{ LocalizeText("useproduct.widget.info.fertilize_monsterplant") }</p>
                                </> }
                        </div>
                        <div className="flex items-center justify-between gap-[15px]">
                            <Button variant="underline" onClick={ onClose }>{ LocalizeText("useproduct.widget.cancel") }</Button>
                            <Button className="w-full" onClick={ useProduct }>{ LocalizeText("useproduct.widget.use") }</Button>
                        </div>
                    </div>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    )
}
