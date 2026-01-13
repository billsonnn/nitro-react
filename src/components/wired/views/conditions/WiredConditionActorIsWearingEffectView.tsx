import { FC, useEffect, useState } from "react"
import { LocalizeText, WiredFurniType } from "../../../../api"
import { useWired } from "../../../../hooks"
import { WiredMessageView } from "../WiredMessageView"
import { WiredConditionBaseView } from "./WiredConditionBaseView"

export const WiredConditionActorIsWearingEffectView: FC<{}> = props =>
{
    const [ effect, setEffect ] = useState(-1)
    const { trigger = null, setIntParams = null } = useWired()

    const save = () => setIntParams([ effect ])

    useEffect(() =>
    {
        setEffect(trigger?.intData[0] ?? 0)
    }, [ trigger ])
    
    return (
        <WiredConditionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } hasSpecialInput={ true } save={ save }>
            <WiredMessageView
                title={ LocalizeText("wiredfurni.tooltip.effectid") }
                value={ effect }    
                onChange={ event => setEffect(parseInt(event.target.value)) }
            />
        </WiredConditionBaseView>
    )
}
