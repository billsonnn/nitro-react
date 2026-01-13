import { FC, useEffect, useState } from "react"
import { GetConfiguration, LocalizeText, WIRED_STRING_DELIMETER, WiredFurniType } from "../../../../api"
import { useWired } from "../../../../hooks"
import { WiredMessageView } from "../WiredMessageView"
import { WiredActionBaseView } from "./WiredActionBaseView"

export const WiredActionBotTalkToAvatarView: FC<{}> = props =>
{
    const [ botName, setBotName ] = useState("")
    const [ message, setMessage ] = useState("")
    const [ talkMode, setTalkMode ] = useState(-1)
    const { trigger = null, setStringParam = null, setIntParams = null } = useWired()

    const save = () =>
    {
        setStringParam(botName + WIRED_STRING_DELIMETER + message)
        setIntParams([ talkMode ])
    }

    useEffect(() =>
    {
        const data = trigger.stringData.split(WIRED_STRING_DELIMETER)
        
        if(data.length > 0) setBotName(data[0])
        if(data.length > 1) setMessage(data[1].length > 0 ? data[1] : "")
    
        setTalkMode((trigger.intData.length > 0) ? trigger.intData[0] : 0)
    }, [ trigger ])

    return (
        <WiredActionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } hasSpecialInput={ true } save={ save }>
            <WiredMessageView
                title={ LocalizeText("wiredfurni.params.bot.name") }   
                value={ botName }    
                onChange={ event => setBotName(event.target.value) }
                maxLength={ 32 }
            />
            <div className="mt-1" />
            <WiredMessageView
                title={ LocalizeText("wiredfurni.params.message") }   
                value={ message }    
                onChange={ event => setMessage(event.target.value) }
                maxLength={ GetConfiguration<number>("wired.action.bot.talk.to.avatar.max.length", 64) }
            />
            <div className="mt-3 flex flex-col gap-2">
                <div className="flex gap-[15px]">
                    <input type="radio" name="talkMode" id="talkMode1" checked={ (talkMode === 0) } onChange={ event => setTalkMode(0) } />
                    <label htmlFor="talkMode1">{ LocalizeText("wiredfurni.params.talk") }</label>
                </div>
                <div className="flex gap-[15px]">
                    <input type="radio" name="talkMode" id="talkMode2" checked={ (talkMode === 1) } onChange={ event => setTalkMode(1) } />
                    <label htmlFor="talkMode2">{ LocalizeText("wiredfurni.params.shout") }</label>
                </div>
            </div>
        </WiredActionBaseView>
    )
}
