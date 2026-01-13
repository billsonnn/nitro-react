import { FC } from "react"
import { CreateLinkEvent, FigureData, LocalizeText } from "../../../../api"
import { Button, NitroCardContentView, NitroCardHeaderView, NitroCardView } from "../../../../common"
import { useFurnitureFootballGateWidget } from "../../../../hooks/rooms/widgets/furniture/useFurnitureFootballGateWidget"

export const FurnitureFootballGateView: FC<{}> = props =>
{
    const { objectId, setObjectId, onClose } = useFurnitureFootballGateWidget()

    const onGender = (gender: string) =>
    {
        CreateLinkEvent(`avatar-editor/show/${ gender }/${ objectId }`)
        setObjectId(-1)
    }

    if(objectId === -1) return null

    return (
        <NitroCardView className="nitro-football-gate no-resize">
            <NitroCardHeaderView headerText={ LocalizeText("widget.furni.clothingchange.gender.title") } onCloseClick={ onClose } />
            <NitroCardContentView className="football-gate-content">
                <p className="text-sm">{ LocalizeText("widget.furni.clothingchange.gender.info") }</p>
                <div className="mt-4 flex items-center justify-between">
                    <Button className="px-8" onClick={ (e) => onGender(FigureData.MALE) }>
                        { LocalizeText("widget.furni.clothingchange.gender.male") }
                    </Button>
                    <Button className="px-8" onClick={ (e) => onGender(FigureData.FEMALE) }>
                        { LocalizeText("widget.furni.clothingchange.gender.female") }
                    </Button>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    )
}