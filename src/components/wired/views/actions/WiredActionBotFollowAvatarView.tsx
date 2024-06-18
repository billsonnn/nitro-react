import { FC, useEffect, useState } from 'react';
import { LocalizeText, WiredFurniType } from '../../../../api';
import { Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { NitroInput } from '../../../../layout';
import { WiredActionBaseView } from './WiredActionBaseView';

export const WiredActionBotFollowAvatarView: FC<{}> = props =>
{
    const [ botName, setBotName ] = useState('');
    const [ followMode, setFollowMode ] = useState(-1);
    const { trigger = null, setStringParam = null, setIntParams = null } = useWired();

    const save = () =>
    {
        setStringParam(botName);
        setIntParams([ followMode ]);
    };

    useEffect(() =>
    {
        setBotName(trigger.stringData);
        setFollowMode((trigger.intData.length > 0) ? trigger.intData[0] : 0);
    }, [ trigger ]);

    return (
        <WiredActionBaseView hasSpecialInput={ true } requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } save={ save }>
            <div className="flex flex-col gap-1">
                <Text bold>{ LocalizeText('wiredfurni.params.bot.name') }</Text>
                <NitroInput maxLength={ 32 } type="text" value={ botName } onChange={ event => setBotName(event.target.value) } />
            </div>
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1">
                    <input checked={ (followMode === 1) } className="form-check-input" id="followMode1" name="followMode" type="radio" onChange={ event => setFollowMode(1) } />
                    <Text>{ LocalizeText('wiredfurni.params.start.following') }</Text>
                </div>
                <div className="flex items-center gap-1">
                    <input checked={ (followMode === 0) } className="form-check-input" id="followMode2" name="followMode" type="radio" onChange={ event => setFollowMode(0) } />
                    <Text>{ LocalizeText('wiredfurni.params.stop.following') }</Text>
                </div>
            </div>
        </WiredActionBaseView>
    );
};
