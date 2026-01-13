import { FC, useEffect, useState } from "react"
import { LocalizeText, WiredFurniType } from "../../../../api"
import { useWired } from "../../../../hooks"
import { WiredActionBaseView } from "./WiredActionBaseView"

export const WiredActionSetFurniStateToView: FC<{}> = props =>
{
    const [ stateFlag, setStateFlag ] = useState(0)
    const [ directionFlag, setDirectionFlag ] = useState(0)
    const [ positionFlag, setPositionFlag ] = useState(0)
    const { trigger = null, setIntParams = null } = useWired()

    const save = () => setIntParams([ stateFlag, directionFlag, positionFlag ])

    useEffect(() =>
    {
        setStateFlag(trigger.getBoolean(0) ? 1 : 0)
        setDirectionFlag(trigger.getBoolean(1) ? 1 : 0)
        setPositionFlag(trigger.getBoolean(2) ? 1 : 0)
    }, [ trigger ])

    return (
        <WiredActionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_BY_ID } hasSpecialInput={ true } save={ save }>
            <div className="flex flex-col gap-2">
                <p className="mb-1.5 font-volter_bold">{ LocalizeText("wiredfurni.params.conditions") }</p>
                <div className="flex items-center gap-3">
                    <input type="checkbox" id="stateFlag" checked={ !!stateFlag } onChange={ event => setStateFlag(event.target.checked ? 1 : 0) } />
                    <label htmlFor="stateFlag">{ LocalizeText("wiredfurni.params.condition.state") }</label>
                </div>
                <div className="flex items-center gap-3">
                    <input type="checkbox" id="directionFlag" checked={ !!directionFlag } onChange={ event => setDirectionFlag(event.target.checked ? 1 : 0) } />
                    <label htmlFor="directionFlag">{ LocalizeText("wiredfurni.params.condition.direction") }</label>
                </div>
                <div className="flex items-center gap-3">
                    <input type="checkbox" id="positionFlag" checked={ !!positionFlag } onChange={ event => setPositionFlag(event.target.checked ? 1 : 0) } />
                    <label htmlFor="positionFlag">{ LocalizeText("wiredfurni.params.condition.position") }</label>
                </div>
            </div>
        </WiredActionBaseView>
    )
}
