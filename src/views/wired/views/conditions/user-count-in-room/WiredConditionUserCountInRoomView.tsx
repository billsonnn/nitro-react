import Slider from 'rc-slider/lib/Slider';
import { FC, useCallback, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../../utils/LocalizeText';
import { useWiredContext } from '../../../context/WiredContext';
import { WiredFurniType } from '../../../WiredView.types';
import { WiredConditionBaseView } from '../base/WiredConditionBaseView';

export const WiredConditionUserCountInRoomView: FC<{}> = props =>
{
    const [ min, setMin ] = useState(1);
    const [ max, setMax ] = useState(1);
    const { trigger = null, setIntParams = null } = useWiredContext();

    useEffect(() =>
    {
        if(trigger.intData.length >= 2)
        {
            setMin(trigger.intData[0]);
            setMax(trigger.intData[1]);
        }
    }, [ trigger ]);

    const save = useCallback(() =>
    {
        setIntParams([min, max]);
    }, [ min, max, setIntParams ]);
    
    return (
        <WiredConditionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } save={ save }>
            <div className="fw-bold">{ LocalizeText('wiredfurni.params.usercountmin', ['value'], [min.toString()]) }</div>
            <Slider 
                defaultValue={ min }
                dots={ true }
                min={ 1 }
                max={ 50 }
                step={ 1 }
                onChange={ event => setMin(event) }
                />
            <hr className="my-1 mb-2 bg-dark" />
            <div className="fw-bold">{ LocalizeText('wiredfurni.params.usercountmax', ['value'], [max.toString()]) }</div>
            <Slider 
                defaultValue={ max }
                dots={ true }
                min={ 1 }
                max={ 50 }
                step={ 1 }
                onChange={ event => setMax(event) }
                />
        </WiredConditionBaseView>
    );
}
