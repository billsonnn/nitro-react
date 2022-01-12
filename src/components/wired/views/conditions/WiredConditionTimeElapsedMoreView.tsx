import { FC, useCallback, useEffect, useState } from 'react';
import ReactSlider from 'react-slider';
import { LocalizeText } from '../../../../api';
import { GetWiredTimeLocale } from '../../common/GetWiredTimeLocale';
import { WiredFurniType } from '../../common/WiredFurniType';
import { useWiredContext } from '../../context/WiredContext';
import { WiredConditionBaseView } from './WiredConditionBaseView';

export const WiredConditionTimeElapsedMoreView: FC<{}> = props =>
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
                <label className="fw-bold">{ LocalizeText('wiredfurni.params.allowafter', [ 'seconds' ], [ GetWiredTimeLocale(time) ]) }</label>
                <ReactSlider
                    className={ 'nitro-slider' }
                    min={ 1 }
                    max={ 1200 }
                    value={ time }
                    onChange={ event => setTime(event) } />
            </div>
        </WiredConditionBaseView>
    );
}
