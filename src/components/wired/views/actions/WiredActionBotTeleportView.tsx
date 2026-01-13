import { FC, useEffect, useState } from "react"
import { LocalizeText, WiredFurniType } from "../../../../api"
import { useWired } from "../../../../hooks"
import { WiredMessageView } from "../WiredMessageView"
import { WiredActionBaseView } from "./WiredActionBaseView"

export const WiredActionBotTeleportView: FC<{}> = props =>
{
    const [ botName, setBotName ] = useState("")
    const { trigger = null, setStringParam = null } = useWired()

    const save = () => setStringParam(botName)

    useEffect(() =>
    {
        setBotName(trigger.stringData)
    }, [ trigger ])

    return (
        <WiredActionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_BY_ID } hasSpecialInput={ true } save={ save }>
            <WiredMessageView
                title={ LocalizeText("wiredfurni.params.bot.name") }   
                value={ botName }    
                onChange={ event => setBotName(event.target.value) }
                maxLength={ 32 }
            />
        </WiredActionBaseView>
    )
}
