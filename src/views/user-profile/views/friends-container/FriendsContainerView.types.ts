import { RelationshipStatusInfoMessageParser } from '@nitrots/nitro-renderer';

export interface FriendsContainerViewProps {
    relationships: RelationshipStatusInfoMessageParser;
    friendsCount: number;
}
