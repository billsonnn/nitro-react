import { FurnitureStackHeightComposer } from "@nitrots/nitro-renderer"
import { FC, useEffect, useState } from "react"
import ReactSlider from "react-slider"
import { LocalizeText, SendMessageComposer } from "../../../../api"
import { Button, NitroCardContentView, NitroCardHeaderView, NitroCardView } from "../../../../common"
import { useFurnitureStackHeightWidget } from "../../../../hooks"

export const FurnitureStackHeightView: FC<{}> = props =>
{
    const { objectId = -1, height = 0, maxHeight = 10, onClose = null, updateHeight = null } = useFurnitureStackHeightWidget()
    const [ tempHeight, setTempHeight ] = useState("")

    const updateTempHeight = (value: string) =>
    {
        setTempHeight(value)

        const newValue = parseFloat(value)

        if(isNaN(newValue) || (newValue === height)) return

        updateHeight(newValue)
    }

    useEffect(() =>
    {
        setTempHeight(height.toString())
    }, [ height ])

    if(objectId === -1) return null

    return (
        <NitroCardView uniqueKey="furniture-stack-height" className="illumina-furniture-stack-height w-80">
            <NitroCardHeaderView headerText={ LocalizeText("widget.custom.stack.height.title") } onCloseClick={ onClose } />
            <NitroCardContentView>
                <p className="mb-[25px] text-sm">{ LocalizeText("widget.custom.stack.height.text") }</p>
                <div className="mb-3.5 flex items-center gap-0.5">
                    <ReactSlider
                        className="illumina-input h-[30px] w-[238px]"
                        min={ 0 }
                        max={ 10 }
                        step={ 0.01 }
                        value={ height }
                        onChange={ event => updateHeight(event) }
                        renderThumb={ (props, state) => <div { ...props }>
                            <i className="illumina-card-item block h-[30px] w-5 cursor-pointer" />
                        </div> } />
                    <input className="illumina-input h-[30px] w-[58px] !px-2.5" type="number" min={ 0 } max={ maxHeight } value={ tempHeight } onChange={ event => updateTempHeight(event.target.value) } />
                </div>
                <div className="flex justify-between">
                    <Button className="h-7" onClick={ event => SendMessageComposer(new FurnitureStackHeightComposer(objectId, -100)) }>
                        { LocalizeText("furniture.above.stack") }
                    </Button>
                    <Button className="h-7" onClick={ event => SendMessageComposer(new FurnitureStackHeightComposer(objectId, 0)) }>
                        { LocalizeText("furniture.floor.level") }
                    </Button>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    )
}
