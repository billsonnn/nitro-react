import { FC, useEffect, useState } from "react"
import { LocalizeText, WiredFurniType } from "../../../../api"
import { useWired } from "../../../../hooks"
import { WiredMessageView } from "../WiredMessageView"
import { WiredConditionBaseView } from "./WiredConditionBaseView"

export const WiredConditionActorIsWearingBadgeView: FC<{}> = props =>
{
    const [ badge, setBadge ] = useState("")
    const { trigger = null, setStringParam = null } = useWired()

    const save = () => setStringParam(badge)

    useEffect(() =>
    {
        setBadge(trigger.stringData)
    }, [ trigger ])
    
    return (
        <WiredConditionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } hasSpecialInput={ true } save={ save }>
            <WiredMessageView
                title={ LocalizeText("wiredfurni.params.badgecode") }
                value={ badge }    
                onChange={ event => setBadge(event.target.value) }
            />
        </WiredConditionBaseView>
    )
}
