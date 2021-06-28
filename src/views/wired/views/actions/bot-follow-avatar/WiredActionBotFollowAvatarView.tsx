import { FC, useCallback, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../../utils/LocalizeText';
import { useWiredContext } from '../../../context/WiredContext';
import { WiredFurniType } from '../../../WiredView.types';
import { WiredActionBaseView } from '../base/WiredActionBaseView';

export const WiredActionBotFollowAvatarView: FC<{}> = props =>
{
    const [ botName, setBotName ] = useState('');
    const [ followMode, setFollowMode ] = useState(-1);
    const { trigger = null, setStringParam = null, setIntParams = null } = useWiredContext();

    useEffect(() =>
    {
        setBotName(trigger.stringData);
        setFollowMode((trigger.intData.length > 0) ? trigger.intData[0] : 0);
    }, [ trigger ]);

    const save = useCallback(() =>
    {
        setStringParam(botName);
        setIntParams([followMode]);
    }, [ followMode, botName, setStringParam, setIntParams ]);

    return (
        <WiredActionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } save={ save }>
            <div className="form-group mb-2">
                <label>{ LocalizeText('wiredfurni.params.bot.name') }</label>
                <input type="text" className="form-control form-control-sm" maxLength={ 32 } value={ botName } onChange={ event => setBotName(event.target.value) } />
            </div>
            <div className="form-check">
                <input className="form-check-input" type="radio" name="followMode" id="followMode1" checked={ followMode === 1 } onChange={() => setFollowMode(1)} />
                <label className="form-check-label" htmlFor="followMode1">
                    { LocalizeText('wiredfurni.params.start.following') }
                </label>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="radio" name="followMode" id="followMode2" checked={ followMode === 0 } onChange={() => setFollowMode(0)} />
                <label className="form-check-label" htmlFor="followMode2">
                    { LocalizeText('wiredfurni.params.stop.following') }
                </label>
            </div>
        </WiredActionBaseView>
    );
}
