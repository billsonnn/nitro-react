import { FC, useEffect, useState } from "react"
import { LocalizeText, WiredFurniType } from "../../../../api"
import { useWired } from "../../../../hooks"
import { WiredTriggerBaseView } from "./WiredTriggerBaseView"

export const WiredTriggerAvatarEnterRoomView: FC<{}> = props =>
{
    const [ username, setUsername ] = useState("")
    const [ avatarMode, setAvatarMode ] = useState(0)
    const { trigger = null, setStringParam = null } = useWired()

    const save = () => setStringParam((avatarMode === 1) ? username : "")

    useEffect(() =>
    {
        setUsername(trigger.stringData)
        setAvatarMode(trigger.stringData ? 1 : 0)
    }, [ trigger ])

    return (
        <WiredTriggerBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } hasSpecialInput={ true } save={ save }>
            <div className="mb-[15px]">
                <p className="mb-[7px] font-volter_bold">{ LocalizeText("wiredfurni.params.picktriggerer") }</p>
                <div className="flex flex-col gap-2">
                    <div className="flex gap-[15px]">
                        <input type="radio" name="avatarMode" id="avatarMode0" checked={ (avatarMode === 0) } onChange={ event => setAvatarMode(0) } />
                        <label htmlFor="avatarMode0">{ LocalizeText("wiredfurni.params.anyavatar") }</label>
                    </div>
                    <div className="flex gap-[15px]">
                        <input type="radio" name="avatarMode" id="avatarMode1" checked={ (avatarMode === 1) } onChange={ event => setAvatarMode(1) } />
                        <label htmlFor="avatarMode1">{ LocalizeText("wiredfurni.params.certainavatar") }</label>
                    </div>
                </div>
                { (avatarMode === 1) &&
                    <div className="mt-[5px] pl-5">
                        <input type="text" value={ username } onChange={ event => setUsername(event.target.value) } />
                    </div> }
            </div>
        </WiredTriggerBaseView>
    )
}
