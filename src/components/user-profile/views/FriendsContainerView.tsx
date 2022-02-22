import { RelationshipStatusInfoMessageParser } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { LocalizeText } from '../../../api';
import { RelationshipsContainerView } from './RelationshipsContainerView';

interface FriendsContainerViewProps
{
    relationships: RelationshipStatusInfoMessageParser;
    friendsCount: number;
}

export const FriendsContainerView: FC<FriendsContainerViewProps> = props => 
{
    const { relationships = null, friendsCount = null } = props;

    return (
        <div className="friends-container h-100 d-flex flex-column">
            <div className="mb-1" dangerouslySetInnerHTML={{ __html: LocalizeText('extendedprofile.friends.count', ['count'], [friendsCount.toString()]) }} />
            <div className="mb-1"><b>{LocalizeText('extendedprofile.relstatus')}</b></div>
            <div className="h-100 d-flex flex-column justify-content-between">
                <RelationshipsContainerView relationships={relationships} />
            </div>
        </div>
    )
}
