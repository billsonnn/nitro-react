import { LocalizeText } from '../../../../utils/LocalizeText';
import { NavigatorLockViewStage } from '../NavigatorLockView.types';
import { NavigatorLockDoorbellViewProps } from './NavigatorLockDoorbellView.types';

export function NavigatorLockDoorbellView(props: NavigatorLockDoorbellViewProps): JSX.Element
{
    const { stage = null, onVisitRoom = null, onHideLock = null } = props;

    return (
        <>
            { stage && <div className="mb-3">
                { stage === NavigatorLockViewStage.INIT && LocalizeText('navigator.doorbell.info') }
                { stage === NavigatorLockViewStage.WAITING && LocalizeText('navigator.doorbell.waiting') }
                { stage === NavigatorLockViewStage.FAILED && LocalizeText('navigator.doorbell.no.answer') }
            </div> }
            <div className="d-flex justify-content-between">
                <button type="button" className="btn btn-secondary" onClick={ () => onHideLock() }>{ LocalizeText('generic.cancel') }</button>
                { stage === NavigatorLockViewStage.INIT && <button type="button" className="btn btn-primary" onClick={ () => onVisitRoom() }>{ LocalizeText('navigator.doorbell.button.ring') }</button> }
            </div>
        </>
    );
}
