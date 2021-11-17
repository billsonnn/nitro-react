import { FC } from 'react';
import { VALUE_KEY_DISLIKE, VALUE_KEY_LIKE } from '../../common/VoteValue';
import { QuestionViewProps } from './QuestionView.types';

export const QuestionView:FC<QuestionViewProps> = props =>
{
    const { question = null, canVote = null, vote = null, noVotes = null, yesVotes = null } = props;
    
    return (
        <div className="wordquiz-question p-2 d-flex flex-column gap-2">
            <div className="w-100 d-flex align-items-center gap-2">
                { !canVote && <button className="btn btn-danger btn-sm">{noVotes}</button> }
                <div className="question text-center text-break">{question}</div>
                { !canVote && <button className="btn btn-success btn-sm">{yesVotes}</button> }
            </div>
            {canVote && 
                <div className="w-100 d-flex justify-content-center gap-2">
                    <button className="btn btn-danger btn-sm"><div className="word-quiz-dislike" onClick={ () => vote(VALUE_KEY_DISLIKE) }/></button>
                    <button className="btn btn-success btn-sm"><div className="word-quiz-like" onClick={ () => vote(VALUE_KEY_LIKE) }/></button>
                </div>
            }
        </div>
    )
}
