import { RoomObjectCategory } from '@nitrots/nitro-renderer/src';
import { FC } from 'react';
import { ObjectLocationView } from '../../../object-location/ObjectLocationView';
import { VALUE_KEY_DISLIKE } from '../../common/VoteValue';
import { VoteViewProps } from './VoteView.types';

export const VoteView:FC<VoteViewProps> = props =>
{
    const { userIndex = null , vote = null } = props;

    return (
        <ObjectLocationView objectId={userIndex} category={RoomObjectCategory.UNIT}>
            <button className={`btn btn-${(vote === VALUE_KEY_DISLIKE) ? 'danger' : 'success'} btn-sm px-1`}><div className={`word-quiz-${(vote === VALUE_KEY_DISLIKE) ? 'dislike' : 'like'}-sm`} /></button>
        </ObjectLocationView>
    )
}
