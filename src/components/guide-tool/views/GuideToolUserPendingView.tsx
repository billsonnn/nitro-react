import { GuideSessionRequesterCancelsMessageComposer } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { LocalizeText } from '../../../api';
import { Button, Column, Text } from '../../../common';
import { SendMessageHook } from '../../../hooks';

interface GuideToolUserPendingViewProps
{
    helpRequestDescription: string;
    helpRequestAverageTime: number;
}

export const GuideToolUserPendingView: FC<GuideToolUserPendingViewProps> = props =>
{
    const { helpRequestDescription = null, helpRequestAverageTime = 0 } = props;

    const cancelRequest = () => SendMessageHook(new GuideSessionRequesterCancelsMessageComposer());

    return (
        <Column>
            <Column gap={ 0 } className="bg-muted rounded p-2">
                <Text bold>{ LocalizeText('guide.help.request.guide.accept.request.title') }</Text>
                <Text variant="muted">{ LocalizeText('guide.help.request.type.1') }</Text>
                <Text wrap textBreak>{ helpRequestDescription }</Text>
            </Column>
            <Column gap={ 1 }>
                <Text bold>{ LocalizeText('guide.help.request.user.pending.info.title') }</Text>
                <Text>{ LocalizeText('guide.help.request.user.pending.info.message') }</Text>
                <Text>{ LocalizeText('guide.help.request.user.pending.info.waiting', [ 'waitingtime' ], [ helpRequestAverageTime.toString() ]) }</Text>
            </Column>
            <Button variant="danger" onClick={ cancelRequest }>{ LocalizeText('guide.help.request.user.pending.cancel.button') }</Button>
        </Column>
    );
};
