import { useState } from 'react';
import { LocalizeText } from '../../../../utils/LocalizeText';
import { NavigatorLockViewStage } from '../NavigatorLockView.types';
import { NavigatorLockPasswordViewProps } from './NavigatorLockPasswordView.types';

export function NavigatorLockPasswordView(props: NavigatorLockPasswordViewProps): JSX.Element
{
    const { stage = null, onVisitRoom = null, onHideLock = null } = props;

    const [ password, setPassword ] = useState<string>(null);

    return (
        <>
            { stage && <div className="mb-2">
                { stage === NavigatorLockViewStage.INIT && LocalizeText('navigator.password.info') }
                { stage === NavigatorLockViewStage.FAILED && LocalizeText('navigator.password.retryinfo') }
            </div> }
            <div className="form-group mb-3">
                <label>{ LocalizeText('navigator.password.enter') }</label>
                <input autoComplete="off" type="password" className="form-control form-control-sm" placeholder="*****" value={ password } onChange={ (event) => setPassword(event.target.value) } />
            </div>
            <div className="d-flex justify-content-between">
                <button type="button" className="btn btn-secondary" onClick={ () => onHideLock() }>{ LocalizeText('generic.cancel') }</button>
                <button type="button" className="btn btn-primary" onClick={ () => onVisitRoom(password) }>{ LocalizeText('navigator.password.button.try') }</button>
            </div>
        </>
    );
}
