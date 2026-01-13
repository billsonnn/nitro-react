import { FC, useEffect, useState } from "react"
import { LocalizeText, WiredFurniType } from "../../../../api"
import { useWired } from "../../../../hooks"
import { WiredActionBaseView } from "./WiredActionBaseView"

const directionOptions: { value: number, icon: string }[] = [
    {
        value: 4,
        icon: "bg-[-56px_-235px]"
    },
    {
        value: 5,
        icon: "bg-[-83px_-235px]"
    },
    {
        value: 6,
        icon: "bg-[-110px_-235px]"
    },
    {
        value: 7,
        icon: "bg-[-56px_-249px]"
    },
    {
        value: 2,
        icon: "bg-[-83px_-249px]"
    },
    {
        value: 3,
        icon: "bg-[-110px_-249px]"
    },
    {
        value: 1,
        icon: "bg-[-56px_-263px]"
    }
]

const rotationOptions: { value: number, icon: string }[] = [
    {
        value: 0,
        icon: ""
    },
    {
        value: 1,
        icon: "bg-[-83px_-263px]"
    },
    {
        value: 2,
        icon: "bg-[-99px_-262px]"
    },
    {
        value: 3,
        icon: ""
    }
]

export const WiredActionMoveFurniView: FC<{}> = props =>
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
                <p className="mb-1.5 font-volter_bold">{ LocalizeText("wiredfurni.params.movefurni") }</p>
                <div className="mb-2 flex gap-[9px]">
                    <input type="radio" name="selectedTeam" id="movement0" checked={ (movement === 0) } onChange={ event => setMovement(0) } />
                    <label htmlFor="movement0">{ LocalizeText("wiredfurni.params.movefurni.0") }</label>
                </div>
                <div className="flex flex-wrap items-center gap-x-[13px] gap-y-2">
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
                <p className="mb-1.5 font-volter_bold">{ LocalizeText("wiredfurni.params.rotatefurni") }</p>
                <div className="flex flex-col gap-2">
                    { rotationOptions.map(option => {
                        return (
                            <div key={ option.value } className="flex gap-[9px]">
                                <input type="radio" name="rotation" id={ `rotation${ option.value }` } checked={ (rotation === option.value) } onChange={ event => setRotation(option.value) } />
                                <label htmlFor={ `rotation${ option.value }` }>
                                    { option.icon.length > 0 && <i className={ `inline-block h-3 w-[15px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] ${ option.icon }` } /> }
                                    &nbsp;
                                    { LocalizeText(`wiredfurni.params.rotatefurni.${ option.value }`) }
                                </label>
                            </div>
                        )
                    })}
                </div>
            </div>
        </WiredActionBaseView>
    )
}
