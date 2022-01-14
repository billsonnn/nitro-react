import { FC, useCallback, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../api';
import { Column } from '../../../../common/Column';
import { Flex } from '../../../../common/Flex';
import { Text } from '../../../../common/Text';
import { BatchUpdates } from '../../../../hooks';
import { WiredFurniType } from '../../common/WiredFurniType';
import { WIRED_STRING_DELIMETER } from '../../common/WiredStringDelimeter';
import { useWiredContext } from '../../context/WiredContext';
import { WiredActionBaseView } from './WiredActionBaseView';

export const WiredActionBotTalkToAvatarView: FC<{}> = props =>
{
    const [ botName, setBotName ] = useState('');
    const [ message, setMessage ] = useState('');
    const [ talkMode, setTalkMode ] = useState(-1);
    const { trigger = null, setStringParam = null, setIntParams = null } = useWiredContext();

    const save = useCallback(() =>
    {
        BatchUpdates(() =>
        {
            setStringParam(botName + WIRED_STRING_DELIMETER + message);
            setIntParams([ talkMode ]);
        });
    }, [ botName, message, talkMode, setStringParam, setIntParams ]);

    useEffect(() =>
    {
        const data = trigger.stringData.split(WIRED_STRING_DELIMETER);
        
        BatchUpdates(() =>
        {
            if(data.length > 0) setBotName(data[0]);
            if(data.length > 1) setMessage(data[1].length > 0 ? data[1] : '');
    
            setTalkMode((trigger.intData.length > 0) ? trigger.intData[0] : 0);
        });
    }, [ trigger ]);

    return (
        <WiredActionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } save={ save }>
            <Column gap={ 1 }>
                <Text bold>{ LocalizeText('wiredfurni.params.bot.name') }</Text>
                <input type="text" className="form-control form-control-sm" maxLength={ 32 } value={ botName } onChange={ event => setBotName(event.target.value) } />
            </Column>
            <Column gap={ 1 }>
                <Text bold>{ LocalizeText('wiredfurni.params.message') }</Text>
                <input type="text" className="form-control form-control-sm" maxLength={ 64 } value={ message } onChange={ event => setMessage(event.target.value) } />
            </Column>
            <Column gap={ 1 }>
                <Flex alignItems="center" gap={ 1 }>
                    <input className="form-check-input" type="radio" name="talkMode" id="talkMode1" checked={ (talkMode === 0) } onChange={ event => setTalkMode(0) } />
                    <Text>{ LocalizeText('wiredfurni.params.talk') }</Text>
                </Flex>
                <Flex alignItems="center" gap={ 1 }>
                    <input className="form-check-input" type="radio" name="talkMode" id="talkMode2" checked={ (talkMode === 1) } onChange={ event => setTalkMode(1) } />
                    <Text>{ LocalizeText('wiredfurni.params.whisper') }</Text>
                </Flex>
            </Column>
        </WiredActionBaseView>
    );
}
