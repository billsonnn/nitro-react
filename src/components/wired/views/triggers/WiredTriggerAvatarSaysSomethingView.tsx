import { FC, useEffect, useState } from "react"
import { GetSessionDataManager, LocalizeText, WiredFurniType } from "../../../../api"
import { useWired } from "../../../../hooks"
import { WiredMessageView } from "../WiredMessageView"
import { WiredTriggerBaseView } from "./WiredTriggerBaseView"

export const WiredTriggerAvatarSaysSomethingView: FC<{}> = props =>
{
    const [ message, setMessage ] = useState("")
    const [ triggererAvatar, setTriggererAvatar ] = useState(-1)
    const { trigger = null, setStringParam = null, setIntParams = null } = useWired()

    const save = () =>
    {
        setStringParam(message)
        setIntParams([ triggererAvatar ])
    }

    useEffect(() =>
    {
        setMessage(trigger.stringData)
        setTriggererAvatar((trigger.intData.length > 0) ? trigger.intData[0] : 0)
    }, [ trigger ])
    
    return (
        <WiredTriggerBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } hasSpecialInput={ true } save={ save }>
            <WiredMessageView
                title={ LocalizeText("wiredfurni.params.whatissaid") }   
                value={ message }    
                onChange={ event => setMessage(event.target.value) }
            />
            <div className="mb-[7px] mt-1.5 h-px w-full bg-[#232323]" /> 
            <div className="mb-[15px]">
                <p className="mb-[7px] font-volter_bold">{ LocalizeText("wiredfurni.params.picktriggerer") }</p>
                <div className="flex flex-col gap-2">
                    <div className="flex gap-[15px]">
                        <input type="radio" name="triggererAvatar" id="triggererAvatar0" checked={ (triggererAvatar === 0) } onChange={ event => setTriggererAvatar(0) } />
                        <label htmlFor="triggererAvatar0">{ LocalizeText("wiredfurni.params.anyavatar") }</label>
                    </div>
                    <div className="flex gap-[15px]">
                        <input type="radio" name="triggererAvatar" id="triggererAvatar1" checked={ (triggererAvatar === 1) } onChange={ event => setTriggererAvatar(1) } />
                        <label htmlFor="triggererAvatar1">{ GetSessionDataManager().userName }</label>
                    </div>
                </div>
            </div>
        </WiredTriggerBaseView>
    )
}
