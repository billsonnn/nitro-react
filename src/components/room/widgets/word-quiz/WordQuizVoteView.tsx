import { RoomObjectCategory } from "@nitrots/nitro-renderer"
import { FC } from "react"
import { VALUE_KEY_DISLIKE } from "../../../../api"
import { BaseProps } from "../../../../common"
import { ObjectLocationView } from "../object-location/ObjectLocationView"

interface WordQuizVoteViewProps extends BaseProps<HTMLDivElement>
{
    userIndex: number;
    vote: string;
}

export const WordQuizVoteView: FC<WordQuizVoteViewProps> = props =>
{
    const { userIndex = null, vote = null, ...rest } = props

    return (
        <ObjectLocationView objectId={ userIndex } category={ RoomObjectCategory.UNIT } { ...rest }>
            <div className={ `flex size-8 items-center justify-center ${ (vote === VALUE_KEY_DISLIKE) ? "illumina-poll-dislike" : "illumina-poll-like" }` }>
                <i className={ `bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] ${ (vote === VALUE_KEY_DISLIKE) ? "size-[22px] bg-[-444px_-292px]" : "h-[21px] w-[18px] bg-[-393px_-292px]" }` } />
            </div>
        </ObjectLocationView>
    )
}
