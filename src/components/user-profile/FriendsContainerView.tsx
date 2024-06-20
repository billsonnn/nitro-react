import { RelationshipStatusInfoMessageParser } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { LocalizeText } from '../../api';
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
        <div className="flex flex-col gap-1">
            <p className="text-sm">
                <b>{ LocalizeText('extendedprofile.friends.count') }</b> { friendsCount }
            </p>
            <div className="flex flex-col gap-1">
                <p className="text-sm font-bold">{ LocalizeText('extendedprofile.relstatus') }</p>
                <RelationshipsContainerView relationships={ relationships } />
            </div>
        </div>
    );
};
