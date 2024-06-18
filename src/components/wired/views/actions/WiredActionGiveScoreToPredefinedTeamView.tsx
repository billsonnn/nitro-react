import { FC, useEffect, useState } from 'react';
import ReactSlider from 'react-slider';
import { LocalizeText, WiredFurniType } from '../../../../api';
import { Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredActionBaseView } from './WiredActionBaseView';

export const WiredActionGiveScoreToPredefinedTeamView: FC<{}> = props =>
{
    const [ points, setPoints ] = useState(1);
    const [ time, setTime ] = useState(1);
    const [ selectedTeam, setSelectedTeam ] = useState(1);
    const { trigger = null, setIntParams = null } = useWired();

    const save = () => setIntParams([ points, time, selectedTeam ]);

    useEffect(() =>
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
    }, [ trigger ]);

    return (
        <WiredActionBaseView hasSpecialInput={ true } requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } save={ save }>
            <div className="flex flex-col gap-1">
                <Text bold>{ LocalizeText('wiredfurni.params.setpoints', [ 'points' ], [ points.toString() ]) }</Text>
                <ReactSlider
                    className={ 'nitro-slider' }
                    max={ 100 }
                    min={ 1 }
                    value={ points }
                    onChange={ event => setPoints(event) } />
            </div>
            <div className="flex flex-col gap-1">
                <Text bold>{ LocalizeText('wiredfurni.params.settimesingame', [ 'times' ], [ time.toString() ]) }</Text>
                <ReactSlider
                    className={ 'nitro-slider' }
                    max={ 10 }
                    min={ 1 }
                    value={ time }
                    onChange={ event => setTime(event) } />
            </div>
            <div className="flex flex-col gap-1">
                <Text bold>{ LocalizeText('wiredfurni.params.team') }</Text>
                { [ 1, 2, 3, 4 ].map(value =>
                {
                    return (
                        <div key={ value } className="flex gap-1">
                            <input checked={ (selectedTeam === value) } className="form-check-input" id={ `selectedTeam${ value }` } name="selectedTeam" type="radio" onChange={ event => setSelectedTeam(value) } />
                            <Text>{ LocalizeText('wiredfurni.params.team.' + value) }</Text>
                        </div>
                    );
                }) }
            </div>
        </WiredActionBaseView>
    );
};
