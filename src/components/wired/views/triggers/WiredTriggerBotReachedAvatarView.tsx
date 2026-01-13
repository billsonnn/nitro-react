import { FC, useEffect, useState } from "react"
import { LocalizeText, WiredFurniType } from "../../../../api"
import { useWired } from "../../../../hooks"
import { WiredMessageView } from "../WiredMessageView"
import { WiredTriggerBaseView } from "./WiredTriggerBaseView"

export const WiredTriggerBotReachedAvatarView: FC<{}> = props =>
{
    const [ botName, setBotName ] = useState("")
    const { trigger = null, setStringParam = null } = useWired()

    const save = () => setStringParam(botName)

    useEffect(() =>
    {
        setBotName(trigger.stringData)
    }, [ trigger ])
    
    return (
        <WiredTriggerBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } hasSpecialInput={ true } save={ save }>
            <WiredMessageView
                title={ LocalizeText("wiredfurni.params.bot.name") }   
                value={ botName }    
                onChange={ event => setBotName(event.target.value) }
                maxLength={ 32 }
            />
        </WiredTriggerBaseView>
    )
}
