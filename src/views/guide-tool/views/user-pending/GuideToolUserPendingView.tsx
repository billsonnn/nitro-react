import { GuideSessionRequesterCancelsMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback } from 'react';
import { LocalizeText } from '../../../../api';
import { SendMessageHook } from '../../../../hooks';
import { NitroCardContentView } from '../../../../layout';
import { GuideToolUserPendingViewProps } from './GuideToolUserPendingView.types';

export const GuideToolUserPendingView: FC<GuideToolUserPendingViewProps> = props =>
{
    const { helpRequestDescription = null, helpRequestAverageTime = 0 } = props;

    const cancelRequest = useCallback(() =>
    {
        SendMessageHook(new GuideSessionRequesterCancelsMessageComposer());
    }, []);

    return (
        <NitroCardContentView className="text-black flex flex-column gap-2">
            <div className="duty-status py-2 px-3">
                <div className="fw-bold">{ LocalizeText('guide.help.request.guide.accept.request.title') }</div>
                <div className="text-muted">{ LocalizeText('guide.help.request.type.1') }</div>
                <div className="text-wrap text-break">{ helpRequestDescription }</div>
            </div>
            <div>
                <div className="fw-bold">{ LocalizeText('guide.help.request.user.pending.info.title') }</div>
                <div>{ LocalizeText('guide.help.request.user.pending.info.message') }</div>
                <div>{ LocalizeText('guide.help.request.user.pending.info.waiting', ['waitingtime'], [helpRequestAverageTime.toString()]) }</div>
            </div>
            <button className="btn btn-danger mt-auto" onClick={ cancelRequest }>{ LocalizeText('guide.help.request.user.pending.cancel.button') }</button>
        </NitroCardContentView>
    );
};
