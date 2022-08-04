import { FC, useEffect, useState } from 'react';
import { LocalizeText, WiredFurniType } from '../../../../api';
import { Column, Flex, Text } from '../../../../common';
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
        <WiredConditionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } hasSpecialInput={ true } save={ save }>
            <Column gap={ 1 }>
                <Text bold>{ LocalizeText('wiredfurni.params.team') }</Text>
                { teamIds.map(value =>
                {
                    return (
                        <Flex key={ value } gap={ 1 } alignItems="center">
                            <input className="form-check-input" type="radio" name="selectedTeam" id={ `selectedTeam${ value }` } checked={ (selectedTeam === value) } onChange={ event => setSelectedTeam(value) } />
                            <Text>{ LocalizeText(`wiredfurni.params.team.${ value }`) }</Text>
                        </Flex>
                    ) 
                }) }
            </Column>
        </WiredConditionBaseView>
    );
}
