import { FC, useEffect, useState } from 'react';
import { GetConfigurationValue, LocalizeText, WIRED_STRING_DELIMETER, WiredFurniType } from '../../../../api';
import { Column, Flex, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredActionBaseView } from './WiredActionBaseView';

export const WiredActionBotTalkToAvatarView: FC<{}> = props =>
{
    const [ botName, setBotName ] = useState('');
    const [ message, setMessage ] = useState('');
    const [ talkMode, setTalkMode ] = useState(-1);
    const { trigger = null, setStringParam = null, setIntParams = null } = useWired();

    const save = () =>
    {
        setStringParam(botName + WIRED_STRING_DELIMETER + message);
        setIntParams([ talkMode ]);
    }

    useEffect(() =>
    {
        const data = trigger.stringData.split(WIRED_STRING_DELIMETER);
        
        if(data.length > 0) setBotName(data[0]);
        if(data.length > 1) setMessage(data[1].length > 0 ? data[1] : '');
    
        setTalkMode((trigger.intData.length > 0) ? trigger.intData[0] : 0);
    }, [ trigger ]);

    return (
        <WiredActionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } hasSpecialInput={ true } save={ save }>
            <Column gap={ 1 }>
                <Text bold>{ LocalizeText('wiredfurni.params.bot.name') }</Text>
                <input type="text" className="form-control form-control-sm" maxLength={ 32 } value={ botName } onChange={ event => setBotName(event.target.value) } />
            </Column>
            <Column gap={ 1 }>
                <Text bold>{ LocalizeText('wiredfurni.params.message') }</Text>
                <input type="text" className="form-control form-control-sm" maxLength={ GetConfigurationValue<number>('wired.action.bot.talk.to.avatar.max.length', 64) } value={ message } onChange={ event => setMessage(event.target.value) } />
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
