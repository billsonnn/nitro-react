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
        <div className="flex flex-col">
            <Flex className="bg-muted p-2 rounded" gap={ 1 } justifyContent="between">
                <Column gap={ 0 }>
                    <Text bold>{ userName }</Text>
                    <Text>{ LocalizeText('guide.help.request.user.feedback.guide.desc') }</Text>
                </Column>
                <Button disabled variant="danger">{ LocalizeText('guide.help.common.report.link') }</Button>
            </Flex>
            <div className="flex flex-col gap-1">
                <Text bold>{ LocalizeText('guide.help.request.user.feedback.closed.title') }</Text>
                <Text>{ LocalizeText('guide.help.request.user.feedback.closed.desc') }</Text>
            </div>
            { userName && (userName.length > 0) &&
                <>
                    <hr className="bg-dark m-0 mt-auto" />
                    <div className="flex flex-col">
                        <Text bold center>{ LocalizeText('guide.help.request.user.feedback.question') }</Text>
                        <div className="flex gap-1">
                            <Button fullWidth variant="success" onClick={ event => giveFeedback(true) }>{ LocalizeText('guide.help.request.user.feedback.positive.button') }</Button>
                            <Button fullWidth variant="danger" onClick={ event => giveFeedback(false) }>{ LocalizeText('guide.help.request.user.feedback.negative.button') }</Button>
                        </div>
                    </div>
                </> }
        </div>
    );
};
