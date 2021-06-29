import { FriendlyTime } from 'nitro-renderer';
import Slider from 'rc-slider/lib/Slider';
import { FC, useCallback, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../../utils/LocalizeText';
import { useWiredContext } from '../../../context/WiredContext';
import { WiredFurniType } from '../../../WiredView.types';
import { WiredTriggerBaseView } from '../base/WiredTriggerBaseView';

export const WiredTriggeExecutePeriodicallyLongView: FC<{}> = props =>
{
    const [ time, setTime ] = useState(1);
    const { trigger = null, setIntParams = null } = useWiredContext();

    useEffect(() =>
    {
        setTime((trigger.intData.length > 0) ? trigger.intData[0] : 0);
    }, [ trigger ]);

    const save = useCallback(() =>
    {
        setIntParams([ time ]);
    }, [ time,  setIntParams ]);

    return (
        <WiredTriggerBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } save={ save }>
            <div className="fw-bold">{ LocalizeText('wiredfurni.params.setlongtime', [ 'time' ], [ FriendlyTime.format(time * 5).toString() ]) }</div>
            <Slider 
                value={ time }
                min={ 1 }
                max={ 120 }
                onChange={ event => setTime(event) } />
        </WiredTriggerBaseView>
    );
}
