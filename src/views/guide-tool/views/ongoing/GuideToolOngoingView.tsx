import { FC } from 'react';
import { LocalizeText } from '../../../../api';
import { NitroCardContentView } from '../../../../layout';
import { GuideToolOngoingViewProps } from './GuideToolOngoingView.types';

export const GuideToolOngoingView: FC<GuideToolOngoingViewProps> = props =>
{
    const { isGuide = false, userId = 0, userName = null, userFigure = null } = props;

    return (
        <NitroCardContentView className="text-black flex flex-column gap-2">
            <div className="d-flex gap-2 align-items-center">
                { isGuide && <button className="btn btn-primary btn-sm">{ LocalizeText('guide.help.request.guide.ongoing.visit.button') }</button> }
                { isGuide && <button className="btn btn-primary btn-sm">{ LocalizeText('guide.help.request.guide.ongoing.invite.button') }</button> }
                { !isGuide && <div>
                    <div className="fw-bold">{ userName }</div>
                    <div>{ LocalizeText('guide.help.request.user.ongoing.guide.desc') }</div>
                </div> }
                <div className="ms-auto text-decoration-underline cursor-pointer text-nowrap">{ LocalizeText('guide.help.common.report.link') }</div>
            </div>
            <hr className="bg-dark m-0" />
            <div>chat</div>
            <hr className="bg-dark m-0" />
            <div className="btn btn-success btn-sm">{ LocalizeText('guide.help.request.' + (isGuide ? 'guide' : 'user') + '.ongoing.close.link') }</div>
        </NitroCardContentView>
    );
};
