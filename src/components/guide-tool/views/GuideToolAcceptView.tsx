import { GuideSessionGuideDecidesMessageComposer } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { LocalizeText, SendMessageComposer } from '../../../api';
import { Button, Column, Text } from '../../../common';

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
        <Column>
            <Column gap={ 0 } className="bg-muted p-2 rounded">
                <Text bold>{ LocalizeText('guide.help.request.guide.accept.request.title') }</Text>
                <Text variant="muted">{ LocalizeText('guide.help.request.type.1') }</Text>
                <Text wrap textBreak>{ helpRequestDescription }</Text>
            </Column>
            <Column gap={ 1 }>
                <Button variant="success" onClick={ event => answerRequest(true) }>
                    { LocalizeText('guide.help.request.guide.accept.accept.button') }
                </Button>
                <Button variant="danger" onClick={ event => answerRequest(false) }>
                    { LocalizeText('guide.help.request.guide.accept.skip.link') }
                </Button>
            </Column>
        </Column>
    );
};
