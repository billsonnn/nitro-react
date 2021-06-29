import { FC, useCallback, useEffect, useState } from 'react';
import { GetSessionDataManager } from '../../../../../api';
import { LocalizeText } from '../../../../../utils/LocalizeText';
import { useWiredContext } from '../../../context/WiredContext';
import { WiredFurniType } from '../../../WiredView.types';
import { WiredTriggerBaseView } from '../base/WiredTriggerBaseView';

export const WiredTriggerAvatarSaysSomethingView: FC<{}> = props =>
{
    const [ message, setMessage ] = useState('');
    const [ triggererAvatar, setTriggererAvatar ] = useState(-1);
    const { trigger = null, setStringParam = null, setIntParams = null } = useWiredContext();

    useEffect(() =>
    {
        setMessage(trigger.stringData);
        setTriggererAvatar((trigger.intData.length > 0) ? trigger.intData[0] : 0);
    }, [ trigger ]);

    const save = useCallback(() =>
    {
        setStringParam(message);
        setIntParams([triggererAvatar]);
    }, [ message, triggererAvatar, setStringParam, setIntParams ]);
    
    return (
        <WiredTriggerBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } save={ save }>
            <div className="form-group">
                <label className="fw-bold">{ LocalizeText('wiredfurni.params.whatissaid') }</label>
                <input type="text" className="form-control form-control-sm" value={ message } onChange={ event => setMessage(event.target.value) } />
            </div>
            <hr className="my-1 mb-2 bg-dark" />
            <div className="fw-bold">{ LocalizeText('wiredfurni.params.picktriggerer') }</div>
            <div className="form-check">
                <input className="form-check-input" type="radio" name="triggererAvatar" id="triggererAvatar0" checked={ triggererAvatar === 0 } onChange={() => setTriggererAvatar(0)} />
                <label className="form-check-label" htmlFor="triggererAvatar0">
                    { LocalizeText('wiredfurni.params.anyavatar') }
                </label>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="radio" name="triggererAvatar" id="triggererAvatar1" checked={ triggererAvatar === 1 } onChange={() => setTriggererAvatar(1)} />
                <label className="form-check-label" htmlFor="triggererAvatar1">
                    { GetSessionDataManager().userName }
                </label>
            </div>
        </WiredTriggerBaseView>
    );
}
