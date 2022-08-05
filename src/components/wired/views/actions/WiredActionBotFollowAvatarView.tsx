import { FC, useEffect, useState } from 'react';
import { LocalizeText, WiredFurniType } from '../../../../api';
import { Column, Flex, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
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
    }

    useEffect(() =>
    {
        setBotName(trigger.stringData);
        setFollowMode((trigger.intData.length > 0) ? trigger.intData[0] : 0);
    }, [ trigger ]);

    return (
        <WiredActionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } hasSpecialInput={ true } save={ save }>
            <Column gap={ 1 }>
                <Text bold>{ LocalizeText('wiredfurni.params.bot.name') }</Text>
                <input type="text" className="form-control form-control-sm" maxLength={ 32 } value={ botName } onChange={ event => setBotName(event.target.value) } />
            </Column>
            <Column gap={ 1 }>
                <Flex alignItems="center" gap={ 1 }>
                    <input className="form-check-input" type="radio" name="followMode" id="followMode1" checked={ (followMode === 1) } onChange={ event => setFollowMode(1) } />
                    <Text>{ LocalizeText('wiredfurni.params.start.following') }</Text>
                </Flex>
                <Flex alignItems="center" gap={ 1 }>
                    <input className="form-check-input" type="radio" name="followMode" id="followMode2" checked={ (followMode === 0) } onChange={ event => setFollowMode(0) } />
                    <Text>{ LocalizeText('wiredfurni.params.stop.following') }</Text>
                </Flex>
            </Column>
        </WiredActionBaseView>
    );
}
