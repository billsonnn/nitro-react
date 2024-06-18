import { FC, useEffect, useState } from 'react';
import { GetConfigurationValue, LocalizeText, WIRED_STRING_DELIMETER, WiredFurniType } from '../../../../api';
import { Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { NitroInput } from '../../../../layout';
import { WiredActionBaseView } from './WiredActionBaseView';

export const WiredActionBotTalkView: FC<{}> = props =>
{
    const [ botName, setBotName ] = useState('');
    const [ message, setMessage ] = useState('');
    const [ talkMode, setTalkMode ] = useState(-1);
    const { trigger = null, setStringParam = null, setIntParams = null } = useWired();

    const save = () =>
    {
        setStringParam(botName + WIRED_STRING_DELIMETER + message);
        setIntParams([ talkMode ]);
    };

    useEffect(() =>
    {
        const data = trigger.stringData.split(WIRED_STRING_DELIMETER);

        if(data.length > 0) setBotName(data[0]);
        if(data.length > 1) setMessage(data[1].length > 0 ? data[1] : '');

        setTalkMode((trigger.intData.length > 0) ? trigger.intData[0] : 0);
    }, [ trigger ]);

    return (
        <WiredActionBaseView hasSpecialInput={ true } requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } save={ save }>
            <div className="flex flex-col gap-1">
                <Text bold>{ LocalizeText('wiredfurni.params.bot.name') }</Text>
                <NitroInput maxLength={ 32 } type="text" value={ botName } onChange={ event => setBotName(event.target.value) } />
            </div>
            <div className="flex flex-col gap-1">
                <Text bold>{ LocalizeText('wiredfurni.params.message') }</Text>
                <NitroInput maxLength={ GetConfigurationValue<number>('wired.action.bot.talk.max.length', 64) } type="text" value={ message } onChange={ event => setMessage(event.target.value) } />
            </div>
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1">
                    <input checked={ (talkMode === 0) } className="form-check-input" id="talkMode1" name="talkMode" type="radio" onChange={ event => setTalkMode(0) } />
                    <Text>{ LocalizeText('wiredfurni.params.talk') }</Text>
                </div>
                <div className="flex items-center gap-1">
                    <input checked={ (talkMode === 1) } className="form-check-input" id="talkMode2" name="talkMode" type="radio" onChange={ event => setTalkMode(1) } />
                    <Text>{ LocalizeText('wiredfurni.params.shout') }</Text>
                </div>
            </div>
        </WiredActionBaseView>
    );
};
