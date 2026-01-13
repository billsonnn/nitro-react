import { FC, useEffect, useState } from "react"
import { LocalizeText, WiredFurniType } from "../../../../api"
import { useWired } from "../../../../hooks"
import { WiredMessageView } from "../WiredMessageView"
import { WiredActionBaseView } from "./WiredActionBaseView"

const ALLOWED_HAND_ITEM_IDS: number[] = [ 2, 5, 7, 8, 9, 10, 27 ]

export const WiredActionBotGiveHandItemView: FC<{}> = props =>
{
    const [ botName, setBotName ] = useState("")
    const [ handItemId, setHandItemId ] = useState(-1)
    const { trigger = null, setStringParam = null, setIntParams = null } = useWired()

    const save = () =>
    {
        setStringParam(botName)
        setIntParams([ handItemId ])
    }

    useEffect(() =>
    {
        setBotName(trigger.stringData)
        setHandItemId((trigger.intData.length > 0) ? trigger.intData[0] : 0)
    }, [ trigger ])

    return (
        <WiredActionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } hasSpecialInput={ true } save={ save }>
            <WiredMessageView
                title={ LocalizeText("wiredfurni.params.bot.name") }   
                value={ botName }    
                onChange={ event => setBotName(event.target.value) }
                maxLength={ 32 }
            />
            <div className="mt-1">
                <p className="mb-1.5 px-0.5 font-volter_bold">{ LocalizeText("wiredfurni.params.handitem") }</p>
                <div className='illumina-select relative flex h-[21px] items-center gap-[3px] px-2.5'>
                    <select className="w-full bg-transparent font-volter text-[9px] text-black" value={ handItemId } onChange={ event => setHandItemId(parseInt(event.target.value)) }>
                        <option className="!text-black" value="0">{ LocalizeText("wiredfurni.tooltip.bot.handitem") }</option>
                        { ALLOWED_HAND_ITEM_IDS.map(value => (
                            <option className="!text-black" key={ value } value={ value }>{ LocalizeText(`handitem${ value }`) }</option>
                        ))}
                    </select>
                    <i className="pointer-events-none h-2 w-3 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-269px_-23px]" />
                </div>
            </div>
        </WiredActionBaseView>
    )
}
