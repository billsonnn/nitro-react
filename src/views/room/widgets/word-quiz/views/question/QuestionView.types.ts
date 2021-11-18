
export interface QuestionViewProps
{
    question: string;
    canVote: boolean;
    vote(value: string): void;
    noVotes: number;
    yesVotes: number;
}
