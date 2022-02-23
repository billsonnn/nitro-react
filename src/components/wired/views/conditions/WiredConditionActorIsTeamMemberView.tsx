import { FC, useCallback, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../api';
import { Column } from '../../../../common/Column';
import { Flex } from '../../../../common/Flex';
import { Text } from '../../../../common/Text';
import { WiredFurniType } from '../../common/WiredFurniType';
import { useWiredContext } from '../../context/WiredContext';
import { WiredConditionBaseView } from './WiredConditionBaseView';

const teamIds: number[] = [ 1, 2, 3, 4 ];

export const WiredConditionActorIsTeamMemberView: FC<{}> = props =>
{
    const [ selectedTeam, setSelectedTeam ] = useState(-1);
    const { trigger = null, setIntParams = null } = useWiredContext();

    const save = useCallback(() =>
    {
        setIntParams([ selectedTeam ]);
    }, [ selectedTeam, setIntParams ]);

    useEffect(() =>
    {
        setSelectedTeam((trigger.intData.length > 0) ? trigger.intData[0] : 0);
    }, [ trigger ]);
    
    return (
        <WiredConditionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } save={ save }>
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
