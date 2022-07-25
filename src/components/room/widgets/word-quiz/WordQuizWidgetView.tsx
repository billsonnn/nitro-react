import { FC } from 'react';
import { VALUE_KEY_DISLIKE, VALUE_KEY_LIKE } from '../../../../api';
import { useWordQuizWidget } from '../../../../hooks';
import { WordQuizQuestionView } from './WordQuizQuestionView';
import { WordQuizVoteView } from './WordQuizVoteView';

export const WordQuizWidgetView: FC<{}> = props =>
{
    const { question = null, answerSent = false, answerCounts = null, userAnswers = null, vote = null } = useWordQuizWidget();

    return (
        <>
            { question &&
                <WordQuizQuestionView question={ question.content } canVote={ !answerSent } vote={ vote } noVotes={ answerCounts.get(VALUE_KEY_DISLIKE) || 0 } yesVotes={ answerCounts.get(VALUE_KEY_LIKE) || 0 } /> }
            { userAnswers &&
                Array.from(userAnswers.entries()).map(([ key, value ], index) => <WordQuizVoteView key={ index } userIndex={ key } vote={ value.value } />) }
        </>
    );
}
