import { FC, useEffect, useState } from "react"
import { LocalizeText, WiredFurniType } from "../../../../api"
import { useWired } from "../../../../hooks"
import { WiredMessageView } from "../WiredMessageView"
import { WiredActionBaseView } from "./WiredActionBaseView"

export const WiredActionBotFollowAvatarView: FC<{}> = props =>
{
    const [ botName, setBotName ] = useState("")
    const [ followMode, setFollowMode ] = useState(-1)
    const { trigger = null, setStringParam = null, setIntParams = null } = useWired()

    const save = () =>
    {
        setStringParam(botName)
        setIntParams([ followMode ])
    }

    useEffect(() =>
    {
        setBotName(trigger.stringData)
        setFollowMode((trigger.intData.length > 0) ? trigger.intData[0] : 0)
    }, [ trigger ])

    return (
        <WiredActionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } hasSpecialInput={ true } save={ save }>
            <WiredMessageView
                title={ LocalizeText("wiredfurni.params.bot.name") }   
                value={ botName }    
                onChange={ event => setBotName(event.target.value) }
                maxLength={ 32 }
            />
            <div className="mt-3 flex flex-col gap-2">
                <div className="flex gap-[15px]">
                    <input type="radio" name="followMode1" id="followMode1" checked={ (followMode === 1) } onChange={ event => setFollowMode(1) } />
                    <label htmlFor="followMode1">{ LocalizeText("wiredfurni.params.start.following") }</label>
                </div>
                <div className="flex gap-[15px]">
                    <input type="radio" name="followMode2" id="followMode2" checked={ (followMode === 0) } onChange={ event => setFollowMode(0) } />
                    <label htmlFor="followMode2">{ LocalizeText("wiredfurni.params.stop.following") }</label>
                </div>
            </div>
        </WiredActionBaseView>
    )
}
