import { FriendlyTime } from "@nitrots/nitro-renderer"
import { FC, useEffect, useState } from "react"
import { LocalizeText, WiredFurniType } from "../../../../api"
import { useWired } from "../../../../hooks"
import { WiredRangeView } from "../WiredRangeView"
import { WiredTriggerBaseView } from "./WiredTriggerBaseView"

export const WiredTriggeExecutePeriodicallyLongView: FC<{}> = props =>
{
    const [ time, setTime ] = useState(1)
    const { trigger = null, setIntParams = null } = useWired()

    const save = () => setIntParams([ time ])

    useEffect(() =>
    {
        setTime((trigger.intData.length > 0) ? trigger.intData[0] : 0)
    }, [ trigger ])

    return (
        <WiredTriggerBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } hasSpecialInput={ true } save={ save }>
            <WiredRangeView
                title={ LocalizeText("wiredfurni.params.setlongtime", [ "time" ], [ FriendlyTime.format(time * 5).toString() ]) }
                setState={ setTime }
                state={ time }
                sliderMin={ 1 }
                sliderMax={ 120 }
            />
        </WiredTriggerBaseView>
    )
}
