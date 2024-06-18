import { RoomObjectCategory } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { VALUE_KEY_DISLIKE } from '../../../../api';
import { BaseProps } from '../../../../common';
import { ObjectLocationView } from '../object-location/ObjectLocationView';

interface WordQuizVoteViewProps extends BaseProps<HTMLDivElement>
{
    userIndex: number;
    vote: string;
}

export const WordQuizVoteView: FC<WordQuizVoteViewProps> = props =>
{
    const { userIndex = null, vote = null, ...rest } = props;

    return (
        <ObjectLocationView category={ RoomObjectCategory.UNIT } objectId={ userIndex } { ...rest }>
            <div className={ `flex justify-center items-center cursor-pointer bg-${ (vote === VALUE_KEY_DISLIKE) ? 'danger' : 'success' } rounded p-1` }>
                <div className={ `word-quiz-${ (vote === VALUE_KEY_DISLIKE) ? 'dislike' : 'like' }-sm` } />
            </div>
        </ObjectLocationView>
    );
};
