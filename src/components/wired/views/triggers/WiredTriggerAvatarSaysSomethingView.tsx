import { FC, useCallback, useEffect, useState } from 'react';
import { GetSessionDataManager, LocalizeText } from '../../../../api';
import { Column } from '../../../../common/Column';
import { Flex } from '../../../../common/Flex';
import { Text } from '../../../../common/Text';
import { BatchUpdates } from '../../../../hooks';
import { WiredFurniType } from '../../common/WiredFurniType';
import { useWiredContext } from '../../context/WiredContext';
import { WiredTriggerBaseView } from './WiredTriggerBaseView';

export const WiredTriggerAvatarSaysSomethingView: FC<{}> = props =>
{
    const [ message, setMessage ] = useState('');
    const [ triggererAvatar, setTriggererAvatar ] = useState(-1);
    const { trigger = null, setStringParam = null, setIntParams = null } = useWiredContext();

    const save = useCallback(() =>
    {
        BatchUpdates(() =>
        {
            setStringParam(message);
            setIntParams([ triggererAvatar ]);
        });
    }, [ message, triggererAvatar, setStringParam, setIntParams ]);

    useEffect(() =>
    {
        BatchUpdates(() =>
        {
            setMessage(trigger.stringData);
            setTriggererAvatar((trigger.intData.length > 0) ? trigger.intData[0] : 0);
        });
    }, [ trigger ]);
    
    return (
        <WiredTriggerBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } save={ save }>
            <Column gap={ 1 }>
                <Text bold>{ LocalizeText('wiredfurni.params.whatissaid') }</Text>
                <input type="text" className="form-control form-control-sm" value={ message } onChange={ event => setMessage(event.target.value) } />
            </Column>
            <Column gap={ 1 }>
                <Text bold>{ LocalizeText('wiredfurni.params.picktriggerer') }</Text>
                <Flex alignItems="center" gap={ 1 }>
                    <input className="form-check-input" type="radio" name="triggererAvatar" id="triggererAvatar0" checked={ (triggererAvatar === 0) } onChange={ event => setTriggererAvatar(0) } />
                    <Text>{ LocalizeText('wiredfurni.params.anyavatar') }</Text>
                </Flex>
                <Flex alignItems="center" gap={ 1 }>
                    <input className="form-check-input" type="radio" name="triggererAvatar" id="triggererAvatar1" checked={ (triggererAvatar === 1) } onChange={ event => setTriggererAvatar(1) } />
                    <Text>{ GetSessionDataManager().userName }</Text>
                </Flex>
            </Column>
        </WiredTriggerBaseView>
    );
}
