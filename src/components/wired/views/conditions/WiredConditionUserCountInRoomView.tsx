import { FC, useEffect, useState } from 'react';
import ReactSlider from 'react-slider';
import { LocalizeText, WiredFurniType } from '../../../../api';
import { Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredConditionBaseView } from './WiredConditionBaseView';

export const WiredConditionUserCountInRoomView: FC<{}> = props =>
{
    const [ min, setMin ] = useState(1);
    const [ max, setMax ] = useState(0);
    const { trigger = null, setIntParams = null } = useWired();

    const save = () => setIntParams([ min, max ]);

    useEffect(() =>
    {
        if(trigger.intData.length >= 2)
        {
            setMin(trigger.intData[0]);
            setMax(trigger.intData[1]);
        }
        else
        {
            setMin(1);
            setMax(0);
        }
    }, [ trigger ]);

    return (
        <WiredConditionBaseView hasSpecialInput={ true } requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } save={ save }>
            <div className="flex flex-col gap-1">
                <Text bold>{ LocalizeText('wiredfurni.params.usercountmin', [ 'value' ], [ min.toString() ]) }</Text>
                <ReactSlider
                    className={ 'nitro-slider' }
                    max={ 50 }
                    min={ 1 }
                    value={ min }
                    onChange={ event => setMin(event) } />
            </div>
            <div className="flex flex-col gap-1">
                <Text bold>{ LocalizeText('wiredfurni.params.usercountmax', [ 'value' ], [ max.toString() ]) }</Text>
                <ReactSlider
                    className={ 'nitro-slider' }
                    max={ 125 }
                    min={ 0 }
                    value={ max }
                    onChange={ event => setMax(event) } />
            </div>
        </WiredConditionBaseView>
    );
};
