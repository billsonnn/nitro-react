import Slider from 'rc-slider/lib/Slider';
import { FC, useCallback, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../../utils/LocalizeText';
import { useWiredContext } from '../../../context/WiredContext';
import { WiredFurniType } from '../../../WiredView.types';
import { WiredActionBaseView } from '../base/WiredActionBaseView';

export const WiredActionGiveScoreToPredefinedTeamView: FC<{}> = props =>
{
    const [ points, setPoints ] = useState(1);
    const [ time, setTime ] = useState(1);
    const [ selectedTeam, setSelectedTeam ] = useState(-1);
    const { trigger = null, setIntParams = null } = useWiredContext();

    useEffect(() =>
    {
        if(trigger.intData.length >= 2)
        {
            setPoints(trigger.intData[0]);
            setTime(trigger.intData[1]);
            setSelectedTeam(trigger.intData[2]);
        }
    }, [ trigger ]);

    const save = useCallback(() =>
    {
        setIntParams([points, time, selectedTeam]);
    }, [ points, time, selectedTeam, setIntParams ]);

    return (
        <WiredActionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } save={ save }>
            <div className="fw-bold">{ LocalizeText('wiredfurni.params.setpoints', [ 'points' ], [ points.toString() ]) }</div>
            <Slider 
                defaultValue={ points }
                dots={ true }
                min={ 1 }
                max={ 100 }
                step={ 1 }
                onChange={ event => setPoints(event) }
                />
            <hr className="my-1 mb-2 bg-dark" />
            <div className="fw-bold">{ LocalizeText('wiredfurni.params.settimesingame', [ 'times' ], [ time.toString() ]) }</div>
            <Slider 
                defaultValue={ time }
                dots={ true }
                min={ 1 }
                max={ 10 }
                step={ 1 }
                onChange={ event => setTime(event) }
                />
            <hr className="my-1 mb-2 bg-dark" />
            <div className="fw-bold">{ LocalizeText('wiredfurni.params.team') }</div>
            { [1, 2, 3, 4].map(team =>
            {
                return (
                    <div key={ team } className="form-check">
                        <input className="form-check-input" type="radio" name="selectedTeam" id={'selectedTeam' + team} checked={ selectedTeam === team } onChange={() => setSelectedTeam(team)} />
                        <label className="form-check-label" htmlFor={'selectedTeam' + team}>
                            { LocalizeText('wiredfurni.params.team.' + team) }
                        </label>
                    </div>
                )
            }) }
        </WiredActionBaseView>
    );
}
