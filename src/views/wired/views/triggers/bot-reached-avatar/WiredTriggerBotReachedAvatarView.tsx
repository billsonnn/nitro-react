import { FC, useCallback, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../../utils/LocalizeText';
import { useWiredContext } from '../../../context/WiredContext';
import { WiredFurniType } from '../../../WiredView.types';
import { WiredTriggerBaseView } from '../base/WiredTriggerBaseView';

export const WiredTriggerBotReachedAvatarView: FC<{}> = props =>
{
    const [ botName, setBotName ] = useState('');
    const { trigger = null, setStringParam = null } = useWiredContext();

    useEffect(() =>
    {
        setBotName(trigger.stringData);
    }, [ trigger ]);

    const save = useCallback(() =>
    {
        setStringParam(botName);
    }, [ botName, setStringParam ]);
    
    return (
        <WiredTriggerBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } save={ save }>
            <div className="form-group">
                <label className="fw-bold">{ LocalizeText('wiredfurni.params.bot.name') }</label>
                <input type="text" className="form-control form-control-sm" maxLength={ 32 } value={ botName } onChange={ event => setBotName(event.target.value) } />
            </div>
        </WiredTriggerBaseView>
    );
}
