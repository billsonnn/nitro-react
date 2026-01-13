import { FC, useEffect, useState } from "react"
import { LocalizeText, WiredFurniType } from "../../../../api"
import { useWired } from "../../../../hooks"
import { WiredConditionBaseView } from "./WiredConditionBaseView"

const teamIds: number[] = [ 1, 2, 3, 4 ]

export const WiredConditionActorIsTeamMemberView: FC<{}> = props =>
{
    const [ selectedTeam, setSelectedTeam ] = useState(-1)
    const { trigger = null, setIntParams = null } = useWired()

    const save = () => setIntParams([ selectedTeam ])

    useEffect(() =>
    {
        setSelectedTeam((trigger.intData.length > 0) ? trigger.intData[0] : 0)
    }, [ trigger ])
    
    return (
        <WiredConditionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } hasSpecialInput={ true } save={ save }>
            <p className="font-volter_bold">{ LocalizeText("wiredfurni.params.team") }</p>
            <div className="mt-2 flex flex-col gap-2">
                { teamIds.map(value => {
                    return (
                        <div key={ value } className="flex gap-[15px]">
                            <input type="radio" name="selectedTeam" id={ `selectedTeam${ value }` } checked={ (selectedTeam === value) } onChange={ event => setSelectedTeam(value) } />
                            <label htmlFor={ `selectedTeam${ value }` }>{ LocalizeText(`wiredfurni.params.team.${ value }`) }</label>
                        </div>
                    ) 
                }) }
            </div>
        </WiredConditionBaseView>
    )
}
