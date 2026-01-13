import { IFurnitureData, RoomObjectCategory } from "@nitrots/nitro-renderer"
import { FC, useEffect, useState } from "react"
import { FurniCategory, GetFurnitureDataForRoomObject, LocalizeText } from "../../../../../api"
import { Button, NitroCardContentView, NitroCardHeaderView, NitroCardView } from "../../../../../common"
import { useRoom } from "../../../../../hooks"

interface MonsterPlantSeedConfirmViewProps
{
    objectId: number;
    onClose: () => void;
}

const MODE_DEFAULT: number = -1
const MODE_MONSTERPLANT_SEED: number = 0

export const MonsterPlantSeedConfirmView: FC<MonsterPlantSeedConfirmViewProps> = props =>
{
    const { objectId = -1, onClose = null } = props
    const [ furniData, setFurniData ] = useState<IFurnitureData>(null)
    const [ mode, setMode ] = useState(MODE_DEFAULT)
    const { roomSession = null } = useRoom()

    const useProduct = () =>
    {
        roomSession.useMultistateItem(objectId)

        onClose()
    }

    useEffect(() =>
    {
        if(!roomSession || (objectId === -1)) return

        const furniData = GetFurnitureDataForRoomObject(roomSession.roomId, objectId, RoomObjectCategory.FLOOR)

        if(!furniData) return

        setFurniData(furniData)

        let mode = MODE_DEFAULT

        switch(furniData.specialType)
        {
        case FurniCategory.MONSTERPLANT_SEED:
            mode = MODE_MONSTERPLANT_SEED
            break
        }

        if(mode === MODE_DEFAULT)
        {
            onClose()

            return
        }

        setMode(mode)
    }, [ roomSession, objectId, onClose ])

    if(mode === MODE_DEFAULT) return null
    
    return (
        <NitroCardView uniqueKey="monsterplant-seed-confirm" className="illumina-monsterplant-seed-confirm w-[350px]">
            <NitroCardHeaderView headerText={ LocalizeText("useproduct.widget.title.plant_seed", [ "name" ], [ furniData.name ]) } onCloseClick={ onClose } />
            <NitroCardContentView center>
                <div className="flex">
                    <div className="h-[130px] w-[122px] shrink-0 bg-[url('/client-assets/images/room-widgets/furni-context/preview-bg.png?v=2451779')]">
                        <i className="block size-full bg-[url('/client-assets/images/room-widgets/furni-context/monsterplant-preview.png?v=2451779')] bg-center bg-no-repeat" />
                    </div>
                    <div className="flex flex-col p-2.5 pb-[5px]">
                        <div className="flex-1">
                            <p className="mb-[15px] text-sm">{ LocalizeText("useproduct.widget.text.plant_seed", [ "productName" ], [ furniData.name ]) }</p>
                            <p className="text-sm italic">{ LocalizeText("useproduct.widget.info.plant_seed") }</p>
                        </div>
                        <div className="flex items-center justify-between gap-[15px]">
                            <Button variant="underline" onClick={ onClose }>{ LocalizeText("useproduct.widget.cancel") }</Button>
                            <Button className="w-full" onClick={ useProduct }>{ LocalizeText("widget.monsterplant_seed.button.use") }</Button>
                        </div>
                    </div>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    )
}
