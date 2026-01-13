import { FC } from "react"
import { ColorUtils, LocalizeText } from "../../../../api"
import { Button, NitroCardContentView, NitroCardHeaderView, NitroCardView } from "../../../../common"
import { useFurnitureBackgroundColorWidget } from "../../../../hooks"

export const FurnitureBackgroundColorView: FC<{}> = props =>
{
    const { objectId = -1, color = 0, setColor = null, applyToner = null, toggleToner = null, onClose = null } = useFurnitureBackgroundColorWidget()

    if(objectId === -1) return null

    return (
        <NitroCardView uniqueKey="furniture-background-color" className="illumina-furniture-background-color w-[250px]">
            <NitroCardHeaderView headerText={ LocalizeText("widget.backgroundcolour.title") } onCloseClick={ onClose } />
            <NitroCardContentView>
                <div className="flex w-full flex-col items-center">
                    <input type="color" className="w-full bg-white px-0.5 dark:bg-black" value={ ColorUtils.makeColorNumberHex(color) } onChange={ event => setColor(ColorUtils.convertFromHex(event.target.value)) } />
                    <div className="mt-2 flex w-full items-center justify-between">
                        <Button onClick={ applyToner }>
                            { LocalizeText("widget.backgroundcolor.button.apply") }
                        </Button>
                        <Button onClick={ toggleToner }>
                            { LocalizeText("widget.backgroundcolor.button.on") }
                        </Button>
                    </div>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    )
}
