import { FC, useEffect, useState } from "react"
import { LocalizeText, WiredFurniType } from "../../../../api"
import { useWired } from "../../../../hooks"
import { WiredConditionBaseView } from "./WiredConditionBaseView"

const ALLOWED_HAND_ITEM_IDS: number[] = [ 2, 5, 7, 8, 9, 10, 27 ]

export const WiredConditionActorHasHandItemView: FC<{}> = props =>
{
    const [ handItemId, setHandItemId ] = useState(-1)
    const { trigger = null, setIntParams = null } = useWired()

    const save = () => setIntParams([ handItemId ])

    useEffect(() =>
    {
        setHandItemId((trigger.intData.length > 0) ? trigger.intData[0] : 0)
    }, [ trigger ])

    return (
        <WiredConditionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } hasSpecialInput={ true } save={ save }>
            <p className="mb-1.5 px-0.5 font-volter_bold">{ LocalizeText("wiredfurni.params.handitem") }</p>
            <div className='illumina-select relative flex h-[21px] items-center gap-[3px] px-2.5'>
                <select className="w-full bg-transparent font-volter text-[9px] text-black" value={ handItemId } onChange={ event => setHandItemId(parseInt(event.target.value)) }>
                    { ALLOWED_HAND_ITEM_IDS.map(value => {
                        return <option className="!text-black" key={ value } value={ value }>{ LocalizeText(`handitem${ value }`) }</option>
                    }) }
                </select>
                <i className="pointer-events-none h-2 w-3 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-269px_-23px]" />
            </div>
        </WiredConditionBaseView>
    )
}
