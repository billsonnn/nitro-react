import Slider from 'rc-slider/lib/Slider';
import { FC, useCallback, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../../utils/LocalizeText';
import { GetWiredTimeLocale } from '../../../common/GetWiredTimeLocale';
import { useWiredContext } from '../../../context/WiredContext';
import { WiredFurniType } from '../../../WiredView.types';
import { WiredConditionBaseView } from '../base/WiredConditionBaseView';

export const WiredConditionTimeElapsedLessView: FC<{}> = props =>
{
    const [ time, setTime ] = useState(-1);
    const { trigger = null, setIntParams = null } = useWiredContext();

    useEffect(() =>
    {
        setTime((trigger.intData.length > 0) ? trigger.intData[0] : 0);
    }, [ trigger ]);

    const save = useCallback(() =>
    {
        setIntParams([ time ]);
    }, [ time, setIntParams ]);
    
    return (
        <WiredConditionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } save={ save }>
            <div className="form-group">
                <label className="fw-bold">{ LocalizeText('wiredfurni.params.allowbefore', [ 'seconds' ], [ GetWiredTimeLocale(time) ]) }</label>
                <Slider 
                    value={ time }
                    min={ 1 }
                    max={ 1200 }
                    onChange={ event => setTime(event) } />
            </div>
        </WiredConditionBaseView>
    );
}
