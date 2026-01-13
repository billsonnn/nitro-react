import { FC, useEffect, useState } from "react"
import { LocalizeText, WiredFurniType } from "../../../../api"
import { useWired } from "../../../../hooks"
import { WiredRangeView } from "../WiredRangeView"
import { WiredConditionBaseView } from "./WiredConditionBaseView"

export const WiredConditionUserCountInRoomView: FC<{}> = props =>
{
    const [ min, setMin ] = useState(1)
    const [ max, setMax ] = useState(1)
    const { trigger = null, setIntParams = null } = useWired()

    const save = () => setIntParams([ min, max ])

    useEffect(() =>
    {
        if(trigger.intData.length >= 2)
        {
            setMin(trigger.intData[0])
            setMax(trigger.intData[1])
        }
        else
        {
            setMin(1)
            setMax(1)
        }
    }, [ trigger ])
    
    return (
        <WiredConditionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } hasSpecialInput={ true } save={ save }>
            <WiredRangeView
                title={ LocalizeText("wiredfurni.params.usercountmin", [ "value" ], [ min.toString() ]) }
                setState={ setMin }
                state={ min }
                sliderMin={ 1 }
                sliderMax={ 50 }
            />
            <div className="my-[7px] h-px w-full bg-[#232323]" />
            <WiredRangeView
                title={ LocalizeText("wiredfurni.params.usercountmax", [ "value" ], [ max.toString() ]) }
                setState={ setMax }
                state={ max }
                sliderMin={ 1 }
                sliderMax={ 50 }
            />
        </WiredConditionBaseView>
    )
}
