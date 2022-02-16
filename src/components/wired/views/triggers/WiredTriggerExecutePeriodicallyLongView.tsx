import { FriendlyTime } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import ReactSlider from 'react-slider';
import { LocalizeText } from '../../../../api';
import { Column } from '../../../../common/Column';
import { Text } from '../../../../common/Text';
import { WiredFurniType } from '../../common/WiredFurniType';
import { useWiredContext } from '../../context/WiredContext';
import { WiredTriggerBaseView } from './WiredTriggerBaseView';

export const WiredTriggeExecutePeriodicallyLongView: FC<{}> = props =>
{
    const [ time, setTime ] = useState(1);
    const { trigger = null, setIntParams = null } = useWiredContext();

    const save = useCallback(() =>
    {
        setIntParams([ time ]);
    }, [ time,  setIntParams ]);

    useEffect(() =>
    {
        setTime((trigger.intData.length > 0) ? trigger.intData[0] : 0);
    }, [ trigger ]);

    return (
        <WiredTriggerBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } save={ save }>
            <Column gap={ 1 }>
                <Text bold>{ LocalizeText('wiredfurni.params.setlongtime', [ 'time' ], [ FriendlyTime.format(time * 5).toString() ]) }</Text>
                <ReactSlider
                    className={ 'nitro-slider' }
                    min={ 1 }
                    max={ 120 }
                    value={ time }
                    onChange={ event => setTime(event) } />
            </Column>
        </WiredTriggerBaseView>
    );
}
