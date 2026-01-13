import { FC, useEffect, useState } from "react"
import { LocalizeText, WiredFurniType } from "../../../../api"
import { useWired } from "../../../../hooks"
import { WiredMessageView } from "../WiredMessageView"
import { WiredTriggerBaseView } from "./WiredTriggerBaseView"

export const WiredTriggerBotReachedStuffView: FC<{}> = props =>
{
    const [ botName, setBotName ] = useState("")
    const { trigger = null, setStringParam = null } = useWired()

    const save = () => setStringParam(botName)

    useEffect(() =>
    {
        setBotName(trigger.stringData)
    }, [ trigger ])
    
    return (
        <WiredTriggerBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_BY_ID_OR_BY_TYPE } hasSpecialInput={ true } save={ save }>
            <WiredMessageView
                title={ LocalizeText("wiredfurni.params.bot.name") }   
                value={ botName }    
                onChange={ event => setBotName(event.target.value) }
                maxLength={ 32 }
            />
        </WiredTriggerBaseView>
    )
}
