import { FC, useEffect, useState } from "react"
import { LocalizeText, WiredFurniType } from "../../../../api"
import { useWired } from "../../../../hooks"
import { WiredRangeView } from "../WiredRangeView"
import { WiredActionBaseView } from "./WiredActionBaseView"

const directionOptions: { value: number, icon: string }[] = [
    {
        value: 0,
        icon: "bg-[-56px_-235px]"
    },
    {
        value: 2,
        icon: "bg-[-83px_-235px]"
    },
    {
        value: 4,
        icon: "bg-[-110px_-235px]"
    },
    {
        value: 6,
        icon: "bg-[-56px_-249px]"
    }
]

export const WiredActionMoveFurniToView: FC<{}> = props =>
{
    const [ spacing, setSpacing ] = useState(-1)
    const [ movement, setMovement ] = useState(-1)
    const { trigger = null, setIntParams = null } = useWired()

    const save = () => setIntParams([ movement, spacing ])

    useEffect(() =>
    {
        if(trigger.intData.length >= 2)
        {
            setSpacing(trigger.intData[1])
            setMovement(trigger.intData[0])
        }
        else
        {
            setSpacing(-1)
            setMovement(-1)
        }
    }, [ trigger ])

    return (
        <WiredActionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_BY_ID_OR_BY_TYPE } hasSpecialInput={ true } save={ save }>
            <div>
                <WiredRangeView
                    title={ LocalizeText("wiredfurni.params.emptytiles", [ "tiles" ], [ spacing.toString() ]) }
                    setState={ setSpacing }
                    state={ spacing }
                    sliderMin={ 1 }
                    sliderMax={ 5 }
                />
            </div>
            <div className="my-[7px] h-px w-full bg-[#232323]" />
            <div>
                <p className="mb-1.5 font-volter_bold">{ LocalizeText("wiredfurni.params.startdir") }</p>
                <div className="flex items-center gap-[13px]">
                    { directionOptions.map((value, index) => {
                        return (
                            <div key={ index } className="flex gap-1">
                                <input type="radio" name="movement" id={ `movement${ value.value }` } checked={ (movement === value.value) } onChange={ event => setMovement(value.value) } />
                                <i className={ `block h-[13px] w-[26px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] ${ value.icon }` } />
                            </div>
                        )
                    }) }
                </div>
            </div>
        </WiredActionBaseView>
    )
}
