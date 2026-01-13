import { FC, useEffect, useState } from "react"
import { LocalizeText, WiredFurniType } from "../../../../api"
import { useWired } from "../../../../hooks"
import { WiredActionBaseView } from "./WiredActionBaseView"

export const WiredActionJoinTeamView: FC<{}> = props =>
{
    const [ selectedTeam, setSelectedTeam ] = useState(-1)
    const { trigger = null, setIntParams = null } = useWired()

    const save = () => setIntParams([ selectedTeam ])

    useEffect(() =>
    {
        setSelectedTeam((trigger.intData.length > 0) ? trigger.intData[0] : 0)
    }, [ trigger ])

    return (
        <WiredActionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } hasSpecialInput={ true } save={ save }>
            <p className="font-volter_bold">{ LocalizeText("wiredfurni.params.team") }</p>
            <div className="mt-2 flex flex-col gap-2">
                { [ 1, 2, 3, 4 ].map(team => {
                    return (
                        <div key={ team } className="flex gap-[15px]">
                            <input type="radio" name="selectedTeam" id={ `selectedTeam${ team }` } checked={ (selectedTeam === team) } onChange={ event => setSelectedTeam(team) } />
                            <label htmlFor={ `selectedTeam${ team }` }>{ LocalizeText(`wiredfurni.params.team.${ team }`) }</label>
                        </div>
                    )
                })}
            </div>
        </WiredActionBaseView>
    )
}
