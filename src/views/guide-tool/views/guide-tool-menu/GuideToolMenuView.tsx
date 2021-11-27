import { FC } from 'react';
import { LocalizeText } from '../../../../api';
import { NitroCardContentView } from '../../../../layout';
import { GuideToolMenuViewProps } from './GuideToolMenuView.types';

export const GuideToolMenuView: FC<GuideToolMenuViewProps> = props =>
{
    const {
        isOnDuty = false,
        isHandlingGuideRequests = false,
        setIsHandlingGuideRequests = null,
        isHandlingHelpRequests = false,
        setIsHandlingHelpRequests = null,
        isHandlingBullyReports = false,
        setIsHandlingBullyReports = null,
        guidesOnDuty = 0,
        helpersOnDuty = 0,
        guardiansOnDuty = 0,
        processAction = null
    } = props;
    
    return (
        <>
            <NitroCardContentView className="text-black flex flex-column gap-2">
                <div className="duty-status py-2 px-3 d-flex gap-2 align-items-center">
                    <div>
                        <div className={ 'duty-switch' + (isOnDuty ? '' : ' off') } onClick={ () => processAction('toggle_duty') } />
                    </div>
                    <div>
                        <div className="fw-bold">{ LocalizeText('guide.help.guide.tool.yourstatus') }</div>
                        <div>{ LocalizeText(`guide.help.guide.tool.duty.${(isOnDuty ? 'on' : 'off')}`) }</div>
                    </div>
                </div>
                <div>
                    <div className="fw-bold">{ LocalizeText('guide.help.guide.tool.tickettypeselection.caption') }</div>
                    <div className="form-check">
                        <input className="form-check-input" disabled={ isOnDuty } type="checkbox" checked={ isHandlingGuideRequests } onChange={ e => { setIsHandlingGuideRequests(e.target.checked) } } />
                        <label className="form-check-label">{ LocalizeText('guide.help.guide.tool.tickettypeselection.guiderequests') }</label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" disabled={ isOnDuty } type="checkbox" checked={ isHandlingHelpRequests } onChange={ e => { setIsHandlingHelpRequests(e.target.checked) } } />
                        <label className="form-check-label">{ LocalizeText('guide.help.guide.tool.tickettypeselection.onlyhelprequests') }</label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" disabled={ isOnDuty } type="checkbox" checked={ isHandlingBullyReports } onChange={ e => { setIsHandlingBullyReports(e.target.checked) } } />
                        <label className="form-check-label">{ LocalizeText('guide.help.guide.tool.tickettypeselection.bullyreports') }</label>
                    </div>
                </div>
                <hr className="bg-dark m-0" />
                <div className="d-flex align-items-center justify-content-center gap-2">
                    <div className="info-icon" />
                    <div>
                        <div dangerouslySetInnerHTML={ { __html: LocalizeText('guide.help.guide.tool.guidesonduty', ['amount'], [guidesOnDuty.toString()]) } } />
                        <div dangerouslySetInnerHTML={ { __html: LocalizeText('guide.help.guide.tool.helpersonduty', ['amount'], [helpersOnDuty.toString()]) } } />
                        <div dangerouslySetInnerHTML={ { __html: LocalizeText('guide.help.guide.tool.guardiansonduty', ['amount'], [guardiansOnDuty.toString()]) } } />
                    </div>
                </div>
                <hr className="bg-dark m-0 mt-auto" />
                <div className="d-flex gap-2 w-100">
                    <button className="btn btn-primary btn-sm w-100 text-nowrap" onClick={ () => processAction('forum_link') }>{ LocalizeText('guide.help.guide.tool.forum.link') }</button>
                    <button className="btn btn-primary btn-sm w-100 text-nowrap" disabled>{ LocalizeText('guide.help.guide.tool.skill.link') }</button>
                </div>
            </NitroCardContentView>
        </>
    );
}
