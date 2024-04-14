import { GuideSessionRequesterCancelsMessageComposer } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { LocalizeText, SendMessageComposer } from '../../../api';
import { Button, Column, Text } from '../../../common';

interface GuideToolUserPendingViewProps
{
    helpRequestDescription: string;
    helpRequestAverageTime: number;
}

export const GuideToolUserPendingView: FC<GuideToolUserPendingViewProps> = props =>
{
    const { helpRequestDescription = null, helpRequestAverageTime = 0 } = props;

    const cancelRequest = () => SendMessageComposer(new GuideSessionRequesterCancelsMessageComposer());

    return (
        <div className="flex flex-col">
            <Column className="bg-muted rounded p-2" gap={ 0 }>
                <Text bold>{ LocalizeText('guide.help.request.guide.accept.request.title') }</Text>
                <Text variant="muted">{ LocalizeText('guide.help.request.type.1') }</Text>
                <Text textBreak wrap>{ helpRequestDescription }</Text>
            </Column>
            <div className="flex flex-col gap-1">
                <Text bold>{ LocalizeText('guide.help.request.user.pending.info.title') }</Text>
                <Text>{ LocalizeText('guide.help.request.user.pending.info.message') }</Text>
                <Text>{ LocalizeText('guide.help.request.user.pending.info.waiting', [ 'waitingtime' ], [ helpRequestAverageTime.toString() ]) }</Text>
            </div>
            <Button variant="danger" onClick={ cancelRequest }>{ LocalizeText('guide.help.request.user.pending.cancel.button') }</Button>
        </div>
    );
};
