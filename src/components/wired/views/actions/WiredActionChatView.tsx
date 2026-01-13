import { FC, useEffect, useState } from "react"
import { GetConfiguration, LocalizeText, WiredFurniType } from "../../../../api"
import { useWired } from "../../../../hooks"
import { WiredMessageView } from "../WiredMessageView"
import { WiredActionBaseView } from "./WiredActionBaseView"

export const WiredActionChatView: FC<{}> = props =>
{
    const [ message, setMessage ] = useState("")
    const { trigger = null, setStringParam = null } = useWired()

    const save = () => setStringParam(message)

    useEffect(() =>
    {
        setMessage(trigger.stringData)
    }, [ trigger ])

    return (
        <WiredActionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } hasSpecialInput={ true } save={ save }>
            <WiredMessageView
                title={ LocalizeText("wiredfurni.params.message") }   
                value={ message }    
                onChange={ event => setMessage(event.target.value) }
                maxLength={ GetConfiguration<number>("wired.action.chat.max.length", 100) } 
            />
        </WiredActionBaseView>
    )
}
