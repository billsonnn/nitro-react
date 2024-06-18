import { FC, useEffect, useState } from 'react';
import ReactSlider from 'react-slider';
import { GetConfigurationValue, LocalizeText, WiredFurniType } from '../../../../api';
import { Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { NitroInput } from '../../../../layout';
import { WiredActionBaseView } from './WiredActionBaseView';

export const WiredActionMuteUserView: FC<{}> = props =>
{
    const [ time, setTime ] = useState(-1);
    const [ message, setMessage ] = useState('');
    const { trigger = null, setIntParams = null, setStringParam = null } = useWired();

    const save = () =>
    {
        setIntParams([ time ]);
        setStringParam(message);
    };

    useEffect(() =>
    {
        setTime((trigger.intData.length > 0) ? trigger.intData[0] : 0);
        setMessage(trigger.stringData);
    }, [ trigger ]);

    return (
        <WiredActionBaseView hasSpecialInput={ true } requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } save={ save }>
            <div className="flex flex-col gap-1">
                <Text bold>{ LocalizeText('wiredfurni.params.length.minutes', [ 'minutes' ], [ time.toString() ]) }</Text>
                <ReactSlider
                    className={ 'nitro-slider' }
                    max={ 10 }
                    min={ 1 }
                    value={ time }
                    onChange={ event => setTime(event) } />
            </div>
            <div className="flex flex-col gap-1">
                <Text bold>{ LocalizeText('wiredfurni.params.message') }</Text>
                <NitroInput maxLength={ GetConfigurationValue<number>('wired.action.mute.user.max.length', 100) } type="text" value={ message } onChange={ event => setMessage(event.target.value) } />
            </div>
        </WiredActionBaseView>
    );
};
