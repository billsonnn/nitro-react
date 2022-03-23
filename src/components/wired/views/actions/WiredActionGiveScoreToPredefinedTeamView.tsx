import { FC, useCallback, useEffect, useState } from 'react';
import ReactSlider from 'react-slider';
import { LocalizeText } from '../../../../api';
import { Column } from '../../../../common/Column';
import { Flex } from '../../../../common/Flex';
import { Text } from '../../../../common/Text';
import { BatchUpdates } from '../../../../hooks';
import { WiredFurniType } from '../../common/WiredFurniType';
import { useWiredContext } from '../../context/WiredContext';
import { WiredActionBaseView } from './WiredActionBaseView';

export const WiredActionGiveScoreToPredefinedTeamView: FC<{}> = props =>
{
    const [ points, setPoints ] = useState(1);
    const [ time, setTime ] = useState(1);
    const [ selectedTeam, setSelectedTeam ] = useState(1);
    const { trigger = null, setIntParams = null } = useWiredContext();

    const save = useCallback(() =>
    {
        setIntParams([ points, time, selectedTeam ]);
    }, [ points, time, selectedTeam, setIntParams ]);

    useEffect(() =>
    {
        BatchUpdates(() =>
        {
            if(trigger.intData.length >= 2)
            {
                setPoints(trigger.intData[0]);
                setTime(trigger.intData[1]);
                setSelectedTeam(trigger.intData[2]);
            }
            else
            {
                setPoints(1);
                setTime(1);
                setSelectedTeam(1);
            }
        });
    }, [ trigger ]);

    return (
        <WiredActionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } hasSpecialInput={ true } save={ save }>
            <Column gap={ 1 }>
                <Text bold>{ LocalizeText('wiredfurni.params.setpoints', [ 'points' ], [ points.toString() ]) }</Text>
                <ReactSlider
                    className={ 'nitro-slider' }
                    min={ 1 }
                    max={ 100 }
                    value={ points }
                    onChange={ event => setPoints(event) } />
            </Column>
            <Column gap={ 1 }>
                <Text bold>{ LocalizeText('wiredfurni.params.settimesingame', [ 'times' ], [ time.toString() ]) }</Text>
                <ReactSlider
                    className={ 'nitro-slider' }
                    min={ 1 }
                    max={ 10 }
                    value={ time }
                    onChange={ event => setTime(event) } />
            </Column>
            <Column gap={ 1 }>
                <Text bold>{ LocalizeText('wiredfurni.params.team') }</Text>
                { [1, 2, 3, 4].map(value =>
                    {
                        return (
                            <Flex key={ value } gap={ 1 }>
                                <input className="form-check-input" type="radio" name="selectedTeam" id={ `selectedTeam${ value }` } checked={ (selectedTeam === value) } onChange={ event => setSelectedTeam(value) } />
                                <Text>{ LocalizeText('wiredfurni.params.team.' + value) }</Text>
                            </Flex>
                        );
                    }) }
            </Column>
        </WiredActionBaseView>
    );
}
