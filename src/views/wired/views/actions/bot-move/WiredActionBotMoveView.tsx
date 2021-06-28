import { FC, useCallback, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../../utils/LocalizeText';
import { useWiredContext } from '../../../context/WiredContext';
import { WiredFurniType } from '../../../WiredView.types';
import { WiredActionBaseView } from '../base/WiredActionBaseView';

export const WiredActionBotMoveView: FC<{}> = props =>
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
        <WiredActionBaseView requiresFurni={ WiredFurniType._Str_4873 } save={ save }>
            <div className="form-group">
                <label>{ LocalizeText('wiredfurni.params.bot.name') }</label>
                <input type="text" className="form-control form-control-sm" maxLength={ 32 } value={ botName } onChange={ event => setBotName(event.target.value) } />
            </div>
        </WiredActionBaseView>
    );
}
