import { FC, useCallback, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../api';
import { Column } from '../../../../common/Column';
import { Text } from '../../../../common/Text';
import { WiredFurniType } from '../../common/WiredFurniType';
import { useWiredContext } from '../../context/WiredContext';
import { WiredTriggerBaseView } from './WiredTriggerBaseView';

export const WiredTriggerBotReachedAvatarView: FC<{}> = props =>
{
    const [ botName, setBotName ] = useState('');
    const { trigger = null, setStringParam = null } = useWiredContext();

    const save = useCallback(() =>
    {
        setStringParam(botName);
    }, [ botName, setStringParam ]);

    useEffect(() =>
    {
        setBotName(trigger.stringData);
    }, [ trigger ]);
    
    return (
        <WiredTriggerBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } save={ save }>
            <Column gap={ 1 }>
                <Text bold>{ LocalizeText('wiredfurni.params.bot.name') }</Text>
                <input type="text" className="form-control form-control-sm" maxLength={ 32 } value={ botName } onChange={ event => setBotName(event.target.value) } />
            </Column>
        </WiredTriggerBaseView>
    );
}
