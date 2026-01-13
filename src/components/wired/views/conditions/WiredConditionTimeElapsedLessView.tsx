import { FC, useEffect, useState } from "react"
import { GetWiredTimeLocale, LocalizeText, WiredFurniType } from "../../../../api"
import { useWired } from "../../../../hooks"
import { WiredRangeView } from "../WiredRangeView"
import { WiredConditionBaseView } from "./WiredConditionBaseView"

export const WiredConditionTimeElapsedLessView: FC<{}> = props =>
{
    const [ time, setTime ] = useState(-1)
    const { trigger = null, setIntParams = null } = useWired()

    const save = () => setIntParams([ time ])

    useEffect(() =>
    {
        setTime((trigger.intData.length > 0) ? trigger.intData[0] : 0)
    }, [ trigger ])
    
    return (
        <WiredConditionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } hasSpecialInput={ true } save={ save }>
            <WiredRangeView
                title={ LocalizeText("wiredfurni.params.allowbefore", [ "seconds" ], [ GetWiredTimeLocale(time) ]) }
                setState={ setTime }
                state={ time }
                sliderMin={ 1 }
                sliderMax={ 1200 }
            />
        </WiredConditionBaseView>
    )
}
