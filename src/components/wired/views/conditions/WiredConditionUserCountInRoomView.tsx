import { FC, useCallback, useEffect, useState } from 'react';
import ReactSlider from 'react-slider';
import { LocalizeText } from '../../../../api';
import { Column } from '../../../../common/Column';
import { Text } from '../../../../common/Text';
import { BatchUpdates } from '../../../../hooks';
import { WiredFurniType } from '../../common/WiredFurniType';
import { useWiredContext } from '../../context/WiredContext';
import { WiredConditionBaseView } from './WiredConditionBaseView';

export const WiredConditionUserCountInRoomView: FC<{}> = props =>
{
    const [ min, setMin ] = useState(1);
    const [ max, setMax ] = useState(1);
    const { trigger = null, setIntParams = null } = useWiredContext();

    const save = useCallback(() =>
    {
        setIntParams([ min, max ]);
    }, [ min, max, setIntParams ]);

    useEffect(() =>
    {
        BatchUpdates(() =>
        {
            if(trigger.intData.length >= 2)
            {
                setMin(trigger.intData[0]);
                setMax(trigger.intData[1]);
            }
            else
            {
                setMin(1);
                setMax(1);
            }
        });
    }, [ trigger ]);
    
    return (
        <WiredConditionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } save={ save }>
            <Column gap={ 1 }>
                <Text bold>{ LocalizeText('wiredfurni.params.usercountmin', [ 'value' ], [ min.toString() ]) }</Text>
                <ReactSlider
                    className={ 'nitro-slider' }
                    min={ 1 }
                    max={ 50 }
                    value={ min }
                    onChange={ event => setMin(event) } />
            </Column>
            <Column gap={ 1 }>
                <Text bold>{ LocalizeText('wiredfurni.params.usercountmax', [ 'value' ], [ max.toString() ]) }</Text>
                <ReactSlider
                    className={ 'nitro-slider' }
                    min={ 1 }
                    max={ 50 }
                    value={ max }
                    onChange={ event => setMax(event) } />
            </Column>
        </WiredConditionBaseView>
    );
}
