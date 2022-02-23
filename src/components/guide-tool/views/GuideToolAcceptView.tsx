import { GuideSessionGuideDecidesMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback } from 'react';
import { LocalizeText } from '../../../api';
import { SendMessageHook } from '../../../hooks';
import { NitroCardContentView } from '../../../layout';

interface GuideToolAcceptViewProps
{
    helpRequestDescription: string;
    helpRequestAverageTime: number;
}

export const GuideToolAcceptView: FC<GuideToolAcceptViewProps> = props =>
{
    const { helpRequestDescription = null, helpRequestAverageTime = 0 } = props;
    
    const answerRequest = useCallback((response: boolean) =>
    {
        SendMessageHook(new GuideSessionGuideDecidesMessageComposer(response));
    }, []);

    return (
        <NitroCardContentView className="text-black flex flex-column gap-2">
            <div className="duty-status py-2 px-3">
                <div className="fw-bold">{ LocalizeText('guide.help.request.guide.accept.request.title') }</div>
                <div className="text-muted">{ LocalizeText('guide.help.request.type.1') }</div>
                <div className="text-wrap text-break">{ helpRequestDescription }</div>
            </div>
            <div className="d-flex flex-column gap-2 w-100">
                <button className="btn btn-success btn-sm" onClick={ () => answerRequest(true) }>{ LocalizeText('guide.help.request.guide.accept.accept.button') }</button>
                <button className="btn btn-danger btn-sm" onClick={ () => answerRequest(false) }>{ LocalizeText('guide.help.request.guide.accept.skip.link') }</button>
            </div>
        </NitroCardContentView>
    );
};
