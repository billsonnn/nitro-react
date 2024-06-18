import { FC, useEffect, useState } from 'react';
import { LocalizeText, WiredFurniType } from '../../../../api';
import { Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredConditionBaseView } from './WiredConditionBaseView';

const teamIds: number[] = [ 1, 2, 3, 4 ];

export const WiredConditionActorIsTeamMemberView: FC<{}> = props =>
{
    const [ selectedTeam, setSelectedTeam ] = useState(-1);
    const { trigger = null, setIntParams = null } = useWired();

    const save = () => setIntParams([ selectedTeam ]);

    useEffect(() =>
    {
        setSelectedTeam((trigger.intData.length > 0) ? trigger.intData[0] : 0);
    }, [ trigger ]);

    return (
        <WiredConditionBaseView hasSpecialInput={ true } requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } save={ save }>
            <div className="flex flex-col gap-1">
                <Text bold>{ LocalizeText('wiredfurni.params.team') }</Text>
                { teamIds.map(value =>
                {
                    return (
                        <div key={ value } className="items-center gap-1">
                            <input checked={ (selectedTeam === value) } className="form-check-input" id={ `selectedTeam${ value }` } name="selectedTeam" type="radio" onChange={ event => setSelectedTeam(value) } />
                            <Text>{ LocalizeText(`wiredfurni.params.team.${ value }`) }</Text>
                        </div>
                    );
                }) }
            </div>
        </WiredConditionBaseView>
    );
};
