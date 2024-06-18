import { GuideSessionGuideDecidesMessageComposer } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { LocalizeText, SendMessageComposer } from '../../../api';
import { Button, Text } from '../../../common';

interface GuideToolAcceptViewProps
{
    helpRequestDescription: string;
    helpRequestAverageTime: number;
}

export const GuideToolAcceptView: FC<GuideToolAcceptViewProps> = props =>
{
    const { helpRequestDescription = null, helpRequestAverageTime = 0 } = props;

    const answerRequest = (response: boolean) => SendMessageComposer(new GuideSessionGuideDecidesMessageComposer(response));

    return (
        <div className="flex flex-col">
            <div className="flex flex-col gap-0 bg-muted p-2 rounded">
                <Text bold>{ LocalizeText('guide.help.request.guide.accept.request.title') }</Text>
                <Text variant="muted">{ LocalizeText('guide.help.request.type.1') }</Text>
                <Text textBreak wrap>{ helpRequestDescription }</Text>
            </div>
            <div className="flex flex-col gap-1">
                <Button variant="success" onClick={ event => answerRequest(true) }>
                    { LocalizeText('guide.help.request.guide.accept.accept.button') }
                </Button>
                <Button variant="danger" onClick={ event => answerRequest(false) }>
                    { LocalizeText('guide.help.request.guide.accept.skip.link') }
                </Button>
            </div>
        </div>
    );
};
