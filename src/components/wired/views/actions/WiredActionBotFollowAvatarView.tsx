import { FC, useCallback, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../api';
import { Column } from '../../../../common/Column';
import { Flex } from '../../../../common/Flex';
import { Text } from '../../../../common/Text';
import { BatchUpdates } from '../../../../hooks';
import { WiredFurniType } from '../../common/WiredFurniType';
import { useWiredContext } from '../../context/WiredContext';
import { WiredActionBaseView } from './WiredActionBaseView';

export const WiredActionBotFollowAvatarView: FC<{}> = props =>
{
    const [ botName, setBotName ] = useState('');
    const [ followMode, setFollowMode ] = useState(-1);
    const { trigger = null, setStringParam = null, setIntParams = null } = useWiredContext();

    const save = useCallback(() =>
    {
        BatchUpdates(() =>
        {
            setStringParam(botName);
            setIntParams([followMode]);
        });
    }, [ followMode, botName, setStringParam, setIntParams ]);

    useEffect(() =>
    {
        BatchUpdates(() =>
        {
            setBotName(trigger.stringData);
            setFollowMode((trigger.intData.length > 0) ? trigger.intData[0] : 0);
        });
    }, [ trigger ]);

    return (
        <WiredActionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } save={ save }>
            <Column gap={ 1 }>
                <label className="fw-bold">{ LocalizeText('wiredfurni.params.bot.name') }</label>
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
