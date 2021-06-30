import { FC, useCallback, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../../utils/LocalizeText';
import { useWiredContext } from '../../../context/WiredContext';
import { WiredFurniType } from '../../../WiredView.types';
import { WiredTriggerBaseView } from '../base/WiredTriggerBaseView';

export const WiredTriggerAvatarEnterRoomView: FC<{}> = props =>
{
    const [ username, setUsername ] = useState('');
    const [ avatarMode, setAvatarMode ] = useState(0);
    const { trigger = null, setStringParam = null } = useWiredContext();

    useEffect(() =>
    {
        setUsername(trigger.stringData);
        setAvatarMode(trigger.stringData ? 1 : 0)
    }, [ trigger ]);

    const save = useCallback(() =>
    {
        if(avatarMode === 1) setStringParam(username);
        else setStringParam('');
    }, [ username, avatarMode, setStringParam ]);

    return (
        <WiredTriggerBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } save={ save }>
            <div className="form-group">
                <label className="fw-bold">{ LocalizeText('wiredfurni.params.picktriggerer') }</label>
                <div className="form-check">
                    <input className="form-check-input" type="radio" name="avatarMode" id="avatarMode0" checked={ (avatarMode === 0) } onChange={ event => setAvatarMode(0) } />
                    <label className="form-check-label" htmlFor="avatarMode0">
                        { LocalizeText('wiredfurni.params.anyavatar') }
                    </label>
                </div>
                <div className="form-check">
                    <input className="form-check-input" type="radio" name="avatarMode" id="avatarMode1" checked={ (avatarMode === 1) } onChange={ event => setAvatarMode(1) } />
                    <label className="form-check-label" htmlFor="avatarMode1">
                        { LocalizeText('wiredfurni.params.certainavatar') }
                    </label>
                </div>
            </div>
            { (avatarMode === 1) &&
                <div className="form-group">
                    <input type="text" className="form-control form-control-sm" value={ username } onChange={ event => setUsername(event.target.value) } />
                </div> }
        </WiredTriggerBaseView>
    );
}
