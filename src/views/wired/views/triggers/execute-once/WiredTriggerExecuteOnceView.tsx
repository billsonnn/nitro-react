import Slider from 'rc-slider/lib/Slider';
import { FC, useCallback, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../../utils/LocalizeText';
import { useWiredContext } from '../../../context/WiredContext';
import { WiredFurniType } from '../../../WiredView.types';
import { WiredTriggerBaseView } from '../base/WiredTriggerBaseView';

export const WiredTriggeExecuteOnceView: FC<{}> = props =>
{
    const [ time, setTime ] = useState(1);
    const { trigger = null, setIntParams = null } = useWiredContext();

    useEffect(() =>
    {
        setTime((trigger.intData.length > 0) ? trigger.intData[0] : 0);
    }, [ trigger ]);

    const save = useCallback(() =>
    {
        setIntParams([time]);
    }, [ time,  setIntParams ]);

    return (
        <WiredTriggerBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } save={ save }>
            <div className="fw-bold">{ LocalizeText('wiredfurni.params.settime', [ 'seconds' ], [ time.toString() ]) }</div>
            <Slider 
                defaultValue={ time }
                dots={ true }
                min={ 1 }
                max={ 60 }
                onChange={ event => setTime(event) }
                />
        </WiredTriggerBaseView>
    );
}
