import { GetCfhStatusMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback } from 'react';
import { LocalizeText } from '../../../api';
import { GuideToolEvent } from '../../../events';
import { dispatchUiEvent, SendMessageHook } from '../../../hooks';
import { useHelpContext } from '../context/HelpContext';

export const HelpIndexView: FC<{}> = props =>
{
    const { helpReportState = null, setHelpReportState = null } = useHelpContext();
    
    const onReportClick = useCallback(() =>
    {
        const reportState = Object.assign({}, helpReportState );
        reportState.currentStep = 1;
        setHelpReportState(reportState);
    },[helpReportState, setHelpReportState]);

    const onRequestMySanctionStatusClick = useCallback(() =>
    {
        SendMessageHook(new GetCfhStatusMessageComposer(false));
    }, []);

    const onNewHelpRequestClick = useCallback(() =>
    {
        dispatchUiEvent(new GuideToolEvent(GuideToolEvent.CREATE_HELP_REQUEST));
    }, []);

    return (
        <div className="d-flex flex-column gap-2">
            <div className="index-image align-self-center"></div>
            <h3 className="m-0 text-center">{ LocalizeText('help.main.frame.title') }</h3>
            <div className="d-flex flex-column gap-1">
                <button className="btn btn-primary" onClick={onNewHelpRequestClick}>{LocalizeText('help.main.help.title')}</button>
                <button className="btn btn-primary" onClick={onReportClick}>{LocalizeText('help.main.bully.subtitle')}</button>
                <button className="btn btn-primary" disabled>{LocalizeText('help.main.self.tips.title')}</button>
                <button className="btn btn-primary" onClick={onRequestMySanctionStatusClick}>{LocalizeText('help.main.my.sanction.status')}</button>
            </div>
        </div>
    )
}
