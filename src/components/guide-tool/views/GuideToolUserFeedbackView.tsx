import { GuideSessionFeedbackMessageComposer } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { LocalizeText, SendMessageComposer } from '../../../api';
import { Button, Column, Flex, Text } from '../../../common';

interface GuideToolUserFeedbackViewProps
{
    userName: string;
}

export const GuideToolUserFeedbackView: FC<GuideToolUserFeedbackViewProps> = props =>
{
    const { userName = null } = props;

    const giveFeedback = (recommend: boolean) => SendMessageComposer(new GuideSessionFeedbackMessageComposer(recommend));

    return (
        <Column>
            <Flex justifyContent="between" gap={ 1 } className="bg-muted p-2 rounded">
                <Column gap={ 0 }>
                    <Text bold>{ userName }</Text>
                    <Text>{ LocalizeText('guide.help.request.user.feedback.guide.desc') }</Text>
                </Column>
                <Button variant="danger" disabled>{ LocalizeText('guide.help.common.report.link') }</Button>
            </Flex>
            <Column gap={ 1 }>
                <Text bold>{ LocalizeText('guide.help.request.user.feedback.closed.title') }</Text>
                <Text>{ LocalizeText('guide.help.request.user.feedback.closed.desc') }</Text>
            </Column>
            { userName && (userName.length > 0) &&
                <>
                    <hr className="bg-dark m-0 mt-auto" />
                    <Column>
                        <Text center bold>{ LocalizeText('guide.help.request.user.feedback.question') }</Text>
                        <Flex gap={ 1 }>
                            <Button fullWidth variant="success" onClick={ event => giveFeedback(true) }>{ LocalizeText('guide.help.request.user.feedback.positive.button') }</Button>
                            <Button fullWidth variant="danger" onClick={ event => giveFeedback(false) }>{ LocalizeText('guide.help.request.user.feedback.negative.button') }</Button>
                        </Flex>
                    </Column>
                </> }
        </Column>
    );
};
