import { FC, useCallback, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../../utils/LocalizeText';
import { useWiredContext } from '../../../context/WiredContext';
import { WiredFurniType } from '../../../WiredView.types';
import { WiredActionBaseView } from '../base/WiredActionBaseView';

const allowedHanditemIds: number[] = [2, 5, 7, 8, 9, 10, 27];

export const WiredActionBotGiveHandItemView: FC<{}> = props =>
{
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
        setIntParams([ handItemId ]);
    }, [ handItemId, botName, setStringParam, setIntParams ]);

    return (
        <WiredActionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } save={ save }>
            <div className="form-group mb-2">
                <label className="fw-bold">{ LocalizeText('wiredfurni.params.bot.name') }</label>
                <input type="text" className="form-control form-control-sm" maxLength={ 32 } value={ botName } onChange={ event => setBotName(event.target.value) } />
            </div>
            <div className="form-group">
                <label className="fw-bold">{ LocalizeText('wiredfurni.params.handitem') }</label>
                <select className="form-select form-select-sm" value={ handItemId } onChange={ event => setHandItemId(parseInt(event.target.value)) }>
                    <option value="0">------</option>
                    { allowedHanditemIds.map(value =>
                        {
                            return <option key={ value } value={ value }>{ LocalizeText(`handitem${ value }`) }</option>
                        }) }
                </select>
            </div>
        </WiredActionBaseView>
    );
}
