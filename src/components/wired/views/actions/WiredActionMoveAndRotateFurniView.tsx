import { FC, useEffect, useState } from "react"
import { LocalizeText, WiredFurniType } from "../../../../api"
import { useWired } from "../../../../hooks"
import { WiredActionBaseView } from "./WiredActionBaseView"

const directionOptions: { value: number, icon: string }[] = [
    {
        value: 0,
        icon: "bg-[-56px_-235px]"
    },
    {
        value: 2,
        icon: "bg-[-83px_-235px]"
    },
    {
        value: 4,
        icon: "bg-[-110px_-235px]"
    },
    {
        value: 6,
        icon: "bg-[-56px_-249px]"
    }
]

const rotationOptions: number[] = [ 0, 1, 2, 3, 4, 5, 6 ]

export const WiredActionMoveAndRotateFurniView: FC<{}> = props =>
{
    const [ movement, setMovement ] = useState(-1)
    const [ rotation, setRotation ] = useState(-1)
    const { trigger = null, setIntParams = null } = useWired()

    const save = () => setIntParams([ movement, rotation ])

    useEffect(() =>
    {
        if(trigger.intData.length >= 2)
        {
            setMovement(trigger.intData[0])
            setRotation(trigger.intData[1])
        }
        else
        {
            setMovement(-1)
            setRotation(-1)
        }
    }, [ trigger ])

    return (
        <WiredActionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_BY_ID_BY_TYPE_OR_FROM_CONTEXT } hasSpecialInput={ true } save={ save }>
            <div>
                <p className="mb-1.5 font-volter_bold">{ LocalizeText("wiredfurni.params.startdir") }</p>
                <div className="flex items-center gap-[13px]">
                    { directionOptions.map((option, index) => {
                        return (
                            <div key={ index } className="flex gap-1">
                                <input type="radio" name="movement" id={ `movement${ option.value }` } checked={ (movement === option.value) } onChange={ event => setMovement(option.value) } />
                                <label htmlFor={ `movement${ option.value }` }>
                                    <i className={ `block h-[13px] w-[26px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] ${ option.icon }` } />
                                </label>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className="my-[7px] h-px w-full bg-[#232323]" />
            <div>
                <p className="mb-1.5 font-volter_bold">{ LocalizeText("wiredfurni.params.turn") }</p>
                <div className="flex flex-col gap-2">
                    { rotationOptions.map((option, index) => {
                        return (
                            <div key={ index } className="flex gap-[9px]">
                                <input type="radio" name="rotation" id={ `rotation${ option }` } checked={ (rotation === option) } onChange={ event => setRotation(option) } />
                                <label htmlFor={ `rotation${ option }` }>
                                    <p>{ LocalizeText(`wiredfurni.params.turn.${ option }`) }</p>
                                </label>
                            </div>
                        )
                    })}
                </div>
            </div>
        </WiredActionBaseView>
    )
}
