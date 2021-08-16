import { FC } from 'react';
import { LocalizeText } from '../../../../utils';
import { RelationshipsContainerView } from '../relationships-container/RelationshipsContainerView';
import { FriendsContainerViewProps } from './FriendsContainerView.types';

export const FriendsContainerView: FC<FriendsContainerViewProps> = props => 
{
    const { relationships = null, friendsCount = null } = props;

    return (
        <div className="friends-container h-100">
            <div className="mb-1" dangerouslySetInnerHTML={{ __html: LocalizeText('extendedprofile.friends.count', ['count'], [friendsCount.toString()]) }} />
            <div className="mb-1"><b>{LocalizeText('extendedprofile.relstatus')}</b></div>
            <RelationshipsContainerView relationships={relationships} />
        </div>
    )
}
