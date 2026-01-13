import { FC, useEffect, useState } from "react"
import { LocalizeText, WiredFurniType } from "../../../../api"
import { useWired } from "../../../../hooks"
import { WiredConditionBaseView } from "./WiredConditionBaseView"

export const WiredConditionFurniMatchesSnapshotView: FC<{}> = props =>
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
        <WiredConditionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_BY_ID } hasSpecialInput={ true } save={ save }>
            <p className="mb-1.5 font-volter_bold">{ LocalizeText("wiredfurni.params.conditions") }</p>
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <input type="checkbox" id="stateFlag" checked={ !!stateFlag } onChange={ event => setStateFlag(event.target.checked ? 1 : 0) } />
                    <p>{ LocalizeText("wiredfurni.params.condition.state") }</p>
                </div>
                <div className="flex items-center gap-3">
                    <input type="checkbox" id="directionFlag" checked={ !!directionFlag } onChange={ event => setDirectionFlag(event.target.checked ? 1 : 0) } />
                    <p>{ LocalizeText("wiredfurni.params.condition.direction") }</p>
                </div>
                <div className="flex items-center gap-3">
                    <input type="checkbox" id="positionFlag" checked={ !!positionFlag } onChange={ event => setPositionFlag(event.target.checked ? 1 : 0) } />
                    <p>{ LocalizeText("wiredfurni.params.condition.position") }</p>
                </div>
            </div>
        </WiredConditionBaseView>
    )
}
