import Slider from 'rc-slider/lib/Slider';
import { FC, useCallback, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../../utils/LocalizeText';
import { useWiredContext } from '../../../context/WiredContext';
import { WiredFurniType } from '../../../WiredView.types';
import { WiredActionBaseView } from '../base/WiredActionBaseView';

export const WiredActionGiveScoreView: FC<{}> = props =>
{
    const [ points, setPoints ] = useState(1);
    const [ time, setTime ] = useState(1);
    const { trigger = null, setIntParams = null } = useWiredContext();

    useEffect(() =>
    {
        if(trigger.intData.length >= 2)
        {
            setPoints(trigger.intData[0]);
            setTime(trigger.intData[1]);
        }
        else
        {
            setPoints(1);
            setTime(1);
        }
    }, [ trigger ]);

    const save = useCallback(() =>
    {
        setIntParams([ points, time ]);
    }, [ points, time, setIntParams ]);

    return (
        <WiredActionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } save={ save }>
            <div className="form-group mb-2">
                <label className="fw-bold">{ LocalizeText('wiredfurni.params.setpoints', [ 'points' ], [ points.toString() ]) }</label>
                <Slider 
                    value={ points }
                    min={ 1 }
                    max={ 100 }
                    onChange={ event => setPoints(event) } />
            </div>
            <div className="form-group">
                <label className="fw-bold">{ LocalizeText('wiredfurni.params.settimesingame', [ 'times' ], [ time.toString() ]) }</label>
                <Slider 
                    value={ time }
                    min={ 1 }
                    max={ 10 }
                    onChange={ event => setTime(event) } />
            </div>
        </WiredActionBaseView>
    );
}
