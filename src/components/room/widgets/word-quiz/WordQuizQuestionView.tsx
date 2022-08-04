import { FC } from 'react';
import { VALUE_KEY_DISLIKE, VALUE_KEY_LIKE } from '../../../../api';
import { Base, Column, Flex, Text } from '../../../../common';

interface WordQuizQuestionViewProps
{
    question: string;
    canVote: boolean;
    vote(value: string): void;
    noVotes: number;
    yesVotes: number;
}

export const WordQuizQuestionView: FC<WordQuizQuestionViewProps> = props =>
{
    const { question = null, canVote = null, vote = null, noVotes = null, yesVotes = null } = props;
    
    return (
        <Column gap={ 2 } className="wordquiz-question p-2">
            { !canVote &&
                <Flex fullWidth alignItems="center" gap={ 2 }>
                    <Flex center pointer className="bg-danger rounded p-2">
                        <Text variant="white">{ noVotes }</Text>
                    </Flex>
                    <Text variant="white" center textBreak>{ question }</Text>
                    <Flex center pointer className="bg-success rounded p-2">
                        <Text variant="white">{ yesVotes }</Text>
                    </Flex>
                </Flex> }
            { canVote &&
                <Column>
                    <Text variant="white" center textBreak>{ question }</Text>
                    <Flex fullWidth justifyContent="center" gap={ 1 }>
                        <Flex center pointer className="bg-danger rounded p-1" onClick={ event => vote(VALUE_KEY_DISLIKE) }>
                            <Base className="word-quiz-dislike" />
                        </Flex>
                        <Flex center pointer className="bg-success rounded p-1" onClick={ event => vote(VALUE_KEY_LIKE) }>
                            <Base className="word-quiz-like" />
                        </Flex>
                    </Flex>
                </Column> }
        </Column>
    );
}
