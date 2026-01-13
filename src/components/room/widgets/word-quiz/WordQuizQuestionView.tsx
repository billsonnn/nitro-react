import { FC } from "react"
import { VALUE_KEY_DISLIKE, VALUE_KEY_LIKE } from "../../../../api"

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
    const { question = null, canVote = null, vote = null, noVotes = null, yesVotes = null } = props
    
    return (
        <div className="absolute top-1.5 flex w-full justify-center">
            <div className="illumina-poll relative z-30 min-h-[74px] max-w-[600px]">
                { !canVote &&
                    <div className="flex px-2 py-1.5">
                        <div className="illumina-poll-dislike flex size-8 items-center justify-center">
                            <p className="text-base font-semibold text-white">{ noVotes }</p>
                        </div>
                        <p className="mt-1 px-[23px] text-center text-xl text-white">{ question }</p>
                        <div className="illumina-poll-like flex size-8 items-center justify-center">
                            <p className="text-base font-semibold text-white">{ yesVotes }</p>
                        </div>
                    </div> }
                { canVote &&
                    <div className="flex flex-col px-2 py-3.5">
                        <p className="text-[8px]xl mb-[35px] text-center text-white">{ question }</p>
                        <div className="flex items-center justify-center gap-[70px]">
                            <div className="illumina-poll-dislike flex size-[50px] cursor-pointer items-center justify-center" onClick={ event => vote(VALUE_KEY_DISLIKE) }>
                                <i className="h-[34px] w-[31px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-412px_-292px]" />
                            </div>
                            <div className="illumina-poll-like flex size-[50px] cursor-pointer items-center justify-center" onClick={ event => vote(VALUE_KEY_LIKE) }>
                                <i className="h-[34px] w-[31px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-361px_-292px]" />
                            </div>
                        </div>
                    </div> }
            </div>
        </div>
        
    )
}
