import { FC } from 'react';
import { QuestionViewProps } from './QuestionView.types';

export const QuestionView:FC<QuestionViewProps> = props =>
{
    const { question = null, canVote = null } = props;
    
    return (
        <div className="word-quiz-question-container w-100 align-content-center d-flex">
            <div className="wordquiz-question p-3 d-flex mx-auto">{question}</div>
        </div>
        
    )
}
