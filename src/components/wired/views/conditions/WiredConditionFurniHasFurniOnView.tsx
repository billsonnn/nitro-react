import { FC, useEffect, useState } from "react"
import { LocalizeText, WiredFurniType } from "../../../../api"
import { useWired } from "../../../../hooks"
import { WiredConditionBaseView } from "./WiredConditionBaseView"

export const WiredConditionFurniHasFurniOnView: FC<{}> = props =>
{
    const [ requireAll, setRequireAll ] = useState(-1)
    const { trigger = null, setIntParams = null } = useWired()

    const save = () => setIntParams([ requireAll ])

    useEffect(() =>
    {
        setRequireAll((trigger.intData.length > 0) ? trigger.intData[0] : 0)
    }, [ trigger ])
    
    return (
        <WiredConditionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_BY_ID } hasSpecialInput={ true } save={ save }>
            <p className="pb-1.5 font-volter_bold">{ LocalizeText("wiredfurni.params.requireall") }</p>
            { [ 0, 1 ].map(value => {
                return (
                    <div key={ value } className="flex gap-[9px]">
                        <input type="radio" name="requireAll" id={ `requireAll${ value }` } checked={ (requireAll === value) } onChange={ event => setRequireAll(value) } />
                        <p>{ LocalizeText(`wiredfurni.params.not_requireall.${ value }`) }</p>
                    </div>
                )
            })}
        </WiredConditionBaseView>
    )
}
