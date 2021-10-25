import { FC, useCallback } from 'react';
import { LocalizeText } from '../../../api';
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

    return (
        <>
            <div className="d-grid col-12 mx-auto justify-content-center">
                <div className="col-12"><h3>{LocalizeText('help.main.frame.title')}</h3></div>
                <div className="index-image align-self-center"></div>
                <p className="text-center">{LocalizeText('help.main.self.description')}</p>
            </div>

            <div className="d-grid gap-2 col-8 mx-auto">
                <button className="btn btn-primary" type="button" onClick={onReportClick}>{LocalizeText('help.main.bully.subtitle')}</button>
                <button className="btn btn-primary" type="button">{LocalizeText('help.main.help.title')}</button>
                <button className="btn btn-primary" type="button">{LocalizeText('help.main.self.tips.title')}</button>
            </div>

            <div className="d-grid gap-2 col-8 mx-auto">
                <button className="btn btn-link" type="button">{LocalizeText('help.main.my.sanction.status')}</button>
            </div>

        </>
    )
}
