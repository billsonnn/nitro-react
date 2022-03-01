import { RoomObjectCategory } from '@nitrots/nitro-renderer/src';
import { FC } from 'react';
import { Base, BaseProps, Flex } from '../../../../common';
import { ObjectLocationView } from '../object-location/ObjectLocationView';
import { VALUE_KEY_DISLIKE } from './common/VoteValue';

interface WordQuizVoteViewProps extends BaseProps<HTMLDivElement>
{
    userIndex: number;
    vote: string;
}

export const WordQuizVoteView: FC<WordQuizVoteViewProps> = props =>
{
    const { userIndex = null, vote = null, ...rest } = props;

    return (
        <ObjectLocationView objectId={ userIndex } category={ RoomObjectCategory.UNIT } { ...rest }>
            <Flex center pointer className={ `bg-${ (vote === VALUE_KEY_DISLIKE) ? 'danger' : 'success' } rounded p-1` }>
                <Base className={ `word-quiz-${ (vote === VALUE_KEY_DISLIKE) ? 'dislike' : 'like' }-sm` } />
            </Flex>
        </ObjectLocationView>
    );
}
