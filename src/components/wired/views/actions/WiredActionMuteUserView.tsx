import { FC, useEffect, useState } from 'react';
import ReactSlider from 'react-slider';
import { LocalizeText, WiredFurniType } from '../../../../api';
import { Column, Text } from '../../../../common';
import { useWiredContext } from '../../WiredContext';
import { WiredActionBaseView } from './WiredActionBaseView';

export const WiredActionMuteUserView: FC<{}> = props =>
{
    const [ time, setTime ] = useState(-1);
    const [ message, setMessage ] = useState('');
    const { trigger = null, setIntParams = null, setStringParam = null } = useWiredContext();

    const save = () =>
    {
        setIntParams([ time ]);
        setStringParam(message);
    }

    useEffect(() =>
    {
        setTime((trigger.intData.length > 0) ? trigger.intData[0] : 0);
        setMessage(trigger.stringData);
    }, [ trigger ]);

    return (
        <WiredActionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } hasSpecialInput={ true } save={ save }>
            <Column gap={ 1 }>
                <Text bold>{ LocalizeText('wiredfurni.params.length.minutes', [ 'minutes' ], [ time.toString() ]) }</Text>
                <ReactSlider
                    className={ 'nitro-slider' }
                    min={ 1 }
                    max={ 10 }
                    value={ time }
                    onChange={ event => setTime(event) } />
            </Column>
            <Column gap={ 1 }>
                <Text bold>{ LocalizeText('wiredfurni.params.message') }</Text>
                <input type="text" className="form-control form-control-sm" value={ message } onChange={ event => setMessage(event.target.value) } maxLength={ 100 } />
            </Column>
        </WiredActionBaseView>
    );
}
