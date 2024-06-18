import { FC, useEffect, useState } from 'react';
import { LocalizeText, WiredFurniType } from '../../../../api';
import { Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredActionBaseView } from './WiredActionBaseView';

export const WiredActionJoinTeamView: FC<{}> = props =>
{
    const [ selectedTeam, setSelectedTeam ] = useState(-1);
    const { trigger = null, setIntParams = null } = useWired();

    const save = () => setIntParams([ selectedTeam ]);

    useEffect(() =>
    {
        setSelectedTeam((trigger.intData.length > 0) ? trigger.intData[0] : 0);
    }, [ trigger ]);

    return (
        <WiredActionBaseView hasSpecialInput={ true } requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } save={ save }>
            <div className="flex flex-col gap-1">
                <Text bold>{ LocalizeText('wiredfurni.params.team') }</Text>
                { [ 1, 2, 3, 4 ].map(team =>
                {
                    return (
                        <div key={ team } className="flex gap-1">
                            <input checked={ (selectedTeam === team) } className="form-check-input" id={ `selectedTeam${ team }` } name="selectedTeam" type="radio" onChange={ event => setSelectedTeam(team) } />
                            <Text>{ LocalizeText(`wiredfurni.params.team.${ team }`) }</Text>
                        </div>
                    );
                }) }
            </div>
        </WiredActionBaseView>
    );
};
