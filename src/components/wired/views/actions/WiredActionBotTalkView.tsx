import { FC, useCallback, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../api';
import { WiredFurniType } from '../../common/WiredFurniType';
import { WIRED_STRING_DELIMETER } from '../../common/WiredStringDelimeter';
import { useWiredContext } from '../../context/WiredContext';
import { WiredActionBaseView } from './WiredActionBaseView';

export const WiredActionBotTalkView: FC<{}> = props =>
{
    const [ botName, setBotName ] = useState('');
    const [ message, setMessage ] = useState('');
    const [ talkMode, setTalkMode ] = useState(-1);
    const { trigger = null, setStringParam = null, setIntParams = null } = useWiredContext();

    useEffect(() =>
    {
        const data = trigger.stringData.split(WIRED_STRING_DELIMETER);
        
        if(data.length > 0) setBotName(data[0]);
        if(data.length > 1) setMessage(data[1].length > 0 ? data[1] : '');

        setTalkMode((trigger.intData.length > 0) ? trigger.intData[0] : 0);
    }, [ trigger ]);

    const save = useCallback(() =>
    {
        setStringParam(botName + WIRED_STRING_DELIMETER + message);
        setIntParams([ talkMode ]);
    }, [ botName, message, talkMode, setStringParam, setIntParams ]);

    return (
        <WiredActionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } save={ save }>
            <div className="form-group mb-2">
                <label className="fw-bold">{ LocalizeText('wiredfurni.params.bot.name') }</label>
                <input type="text" className="form-control form-control-sm" maxLength={ 32 } value={ botName } onChange={ event => setBotName(event.target.value) } />
            </div>
            <div className="form-group mb-2">
                <label className="fw-bold">{ LocalizeText('wiredfurni.params.message') }</label>
                <input type="text" className="form-control form-control-sm" maxLength={ 64 } value={ message } onChange={ event => setMessage(event.target.value) } />
            </div>
            <div className="form-group">
                <div className="form-check">
                    <input className="form-check-input" type="radio" name="talkMode" id="talkMode1" checked={ (talkMode === 0) } onChange={ event => setTalkMode(0) } />
                    <label className="form-check-label" htmlFor="talkMode1">{ LocalizeText('wiredfurni.params.talk') }</label>
                </div>
                <div className="form-check">
                    <input className="form-check-input" type="radio" name="talkMode" id="talkMode2" checked={ (talkMode === 1) } onChange={ event => setTalkMode(1) } />
                    <label className="form-check-label" htmlFor="talkMode2">{ LocalizeText('wiredfurni.params.shout') }</label>
                </div>
            </div>
        </WiredActionBaseView>
    );
}
