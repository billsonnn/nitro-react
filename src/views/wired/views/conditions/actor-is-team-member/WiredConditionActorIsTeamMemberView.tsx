import { FC, useCallback, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../../api';
import { useWiredContext } from '../../../context/WiredContext';
import { WiredFurniType } from '../../../WiredView.types';
import { WiredConditionBaseView } from '../base/WiredConditionBaseView';

const teamIds: number[] = [ 1, 2, 3, 4 ];

export const WiredConditionActorIsTeamMemberView: FC<{}> = props =>
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
        <WiredConditionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } save={ save }>
            <div className="form-group">
                <label className="fw-bold">{ LocalizeText('wiredfurni.params.team') }</label>
                { teamIds.map(value =>
                    {
                        return (
                            <div key={ value } className="form-check">
                                <input className="form-check-input" type="radio" name="selectedTeam" id={ `selectedTeam${ value }` } checked={ (selectedTeam === value) } onChange={ event => setSelectedTeam(value) } />
                                <label className="form-check-label" htmlFor={ `selectedTeam${ value }` }>
                                    { LocalizeText(`wiredfurni.params.team.${ value }`) }
                                </label>
                            </div>
                        )
                    }) }
            </div>
        </WiredConditionBaseView>
    );
}
