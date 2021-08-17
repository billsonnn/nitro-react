import { FC, useCallback, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../../api';
import { useWiredContext } from '../../../context/WiredContext';
import { WiredFurniType } from '../../../WiredView.types';
import { WiredActionBaseView } from '../base/WiredActionBaseView';

export const WiredActionJoinTeamView: FC<{}> = props =>
{
    const [ selectedTeam, setSelectedTeam ] = useState(-1);
    const { trigger = null, setIntParams = null } = useWiredContext();

    useEffect(() =>
    {
        setSelectedTeam((trigger.intData.length > 0) ? trigger.intData[0] : 0);
    }, [ trigger ]);

    const save = useCallback(() =>
    {
        setIntParams([ selectedTeam ]);
    }, [ selectedTeam, setIntParams ]);

    return (
        <WiredActionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } save={ save }>
            <div className="form-group">
                <label className="fw-bold">{ LocalizeText('wiredfurni.params.team') }</label>
                { [1, 2, 3, 4].map(team =>
                    {
                        return (
                            <div key={ team } className="form-check">
                                <input className="form-check-input" type="radio" name="selectedTeam" id={ `selectedTeam${ team }` } checked={ (selectedTeam === team) } onChange={ event => setSelectedTeam(team) } />
                                <label className="form-check-label" htmlFor={ `selectedTeam${ team }` }>
                                    { LocalizeText(`wiredfurni.params.team.${ team }`) }
                                </label>
                            </div>
                        )
                    }) }
            </div>
        </WiredActionBaseView>
    );
}
