import { FC, useCallback, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../../utils/LocalizeText';
import { useWiredContext } from '../../../context/WiredContext';
import { WiredFurniType } from '../../../WiredView.types';
import { WiredActionBaseView } from '../base/WiredActionBaseView';

export const WiredActionBotGiveHandItemView: FC<{}> = props =>
{
    const allowedHanditemIds: number[] = [2, 5, 7, 8, 9, 10, 27];

    const [ botName, setBotName ] = useState('');
    const [ handItemId, setHandItemId ] = useState(-1);
    const { trigger = null, setStringParam = null, setIntParams = null } = useWiredContext();

    useEffect(() =>
    {
        setBotName(trigger.stringData);
        setHandItemId((trigger.intData.length > 0) ? trigger.intData[0] : 0);
    }, [ trigger ]);

    const save = useCallback(() =>
    {
        setStringParam(botName);
        setIntParams([handItemId]);
    }, [ handItemId, botName, setStringParam, setIntParams ]);

    return (
        <WiredActionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } save={ save }>
            <div className="form-group mb-2">
                <label>{ LocalizeText('wiredfurni.params.bot.name') }</label>
                <input type="text" className="form-control form-control-sm" maxLength={ 32 } value={ botName } onChange={ event => setBotName(event.target.value) } />
            </div>
            <div>{ LocalizeText('wiredfurni.tooltip.handitem') }</div>
            <select className="form-select" value={ handItemId } onChange={ (e) => setHandItemId(Number(e.target.value)) }>
                <option value="0">------</option>
                {allowedHanditemIds && allowedHanditemIds.map(value =>
                    {
                        return <option value={ value }>{ LocalizeText('handitem' + value) }</option>
                    })}
            </select>
        </WiredActionBaseView>
    );
}
