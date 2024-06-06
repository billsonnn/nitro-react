import { RelationshipStatusInfoMessageParser } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { LocalizeText } from '../../../api';
import { Text } from '../../../common';
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
            <Text small>
                <b>{ LocalizeText('extendedprofile.friends.count') }</b> { friendsCount }
            </Text>
            <Text bold small>{ LocalizeText('extendedprofile.relstatus') }</Text>
            <div className="flex flex-col gap-2">
                <RelationshipsContainerView relationships={ relationships } />
            </div>
        </div>
    )
}
