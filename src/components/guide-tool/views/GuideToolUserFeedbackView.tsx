import { GuideSessionFeedbackMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback } from 'react';
import { LocalizeText } from '../../../api';
import { SendMessageHook } from '../../../hooks';
import { NitroCardContentView } from '../../../layout';

interface GuideToolUserFeedbackViewProps
{
    userName: string;
}

export const GuideToolUserFeedbackView: FC<GuideToolUserFeedbackViewProps> = props =>
{
    const { userName = null } = props;

    const giveFeedback = useCallback((recommend: boolean) =>
    {
        SendMessageHook(new GuideSessionFeedbackMessageComposer(recommend));
    }, []);

    return (
        <NitroCardContentView className="p-0">
            <div className="d-flex gap-2 align-items-center bg-secondary p-2 text-white">
                <div>
                    <div className="fw-bold">{ userName }</div>
                    <div>{ LocalizeText('guide.help.request.user.feedback.guide.desc') }</div>
                </div>
                <div className="ms-auto text-decoration-underline cursor-pointer text-nowrap">{ LocalizeText('guide.help.common.report.link') }</div>
            </div>
            <div className="text-black d-flex flex-column gap-2 p-2 h-100">
                <div>
                    <div className="fw-bold">{ LocalizeText('guide.help.request.user.feedback.closed.title') }</div>
                    <div>{ LocalizeText('guide.help.request.user.feedback.closed.desc') }</div>
                </div>
                <hr className="bg-dark m-0 mt-auto" />
                <div className="fw-bold text-center">{ LocalizeText('guide.help.request.user.feedback.question') }</div>
                <div className="d-flex gap-2">
                    <div className="btn btn-success w-100" onClick={ () => giveFeedback(true) }>{ LocalizeText('guide.help.request.user.feedback.positive.button') }</div>
                    <div className="btn btn-danger w-100" onClick={ () => giveFeedback(false) }>{ LocalizeText('guide.help.request.user.feedback.negative.button') }</div>
                </div>
            </div>
        </NitroCardContentView>
    );
};
