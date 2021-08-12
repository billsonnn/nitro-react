import { UserRelationshipDataParser } from '@nitrots/nitro-renderer';

export interface FriendsContainerViewProps {
    relationships: Map<string, UserRelationshipDataParser[]>;
    friendsCount: number;
}
