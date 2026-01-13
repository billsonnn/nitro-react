import { FC, useEffect, useState } from "react"
import { GetConfiguration, LocalizeText, WiredFurniType } from "../../../../api"
import { useWired } from "../../../../hooks"
import { WiredMessageView } from "../WiredMessageView"
import { WiredRangeView } from "../WiredRangeView"
import { WiredActionBaseView } from "./WiredActionBaseView"

export const WiredActionMuteUserView: FC<{}> = props =>
{
    const [ time, setTime ] = useState(-1)
    const [ message, setMessage ] = useState("")
    const { trigger = null, setIntParams = null, setStringParam = null } = useWired()

    const save = () =>
    {
        setIntParams([ time ])
        setStringParam(message)
    }

    useEffect(() =>
    {
        setTime((trigger.intData.length > 0) ? trigger.intData[0] : 0)
        setMessage(trigger.stringData)
    }, [ trigger ])

    return (
        <WiredActionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } hasSpecialInput={ true } save={ save }>
            <WiredMessageView
                title={ LocalizeText("wiredfurni.params.message") }   
                value={ message }    
                onChange={ event => setMessage(event.target.value) }
                maxLength={ GetConfiguration<number>("wired.action.mute.user.max.length", 100) }
            />
            <div className="my-[7px] h-px w-full bg-[#232323]" />
            <WiredRangeView
                title={ LocalizeText("wiredfurni.params.length.minutes", [ "minutes", "dk" ], [ time.toString() ]) }
                setState={ setTime }
                state={ time }
                sliderMin={ 1 }
                sliderMax={ 10 }
            />
        </WiredActionBaseView>
    )
}
