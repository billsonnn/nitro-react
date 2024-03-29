import { FC, useEffect, useState } from 'react';
import ReactSlider from 'react-slider';
import { FriendlyTime, LocalizeText, WiredFurniType } from '../../../../api';
import { Column, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredTriggerBaseView } from './WiredTriggerBaseView';

export const WiredTriggeExecutePeriodicallyLongView: FC<{}> = props =>
{
    const [ time, setTime ] = useState(1);
    const { trigger = null, setIntParams = null } = useWired();

    const save = () => setIntParams([ time ]);

    useEffect(() =>
    {
        setTime((trigger.intData.length > 0) ? trigger.intData[0] : 0);
    }, [ trigger ]);

    return (
        <WiredTriggerBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } hasSpecialInput={ true } save={ save }>
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
