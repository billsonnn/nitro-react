import { RelationshipStatusInfoMessageParser } from '@nitrots/nitro-renderer';

export interface RelationshipsContainerViewProps
{
    relationships: RelationshipStatusInfoMessageParser;
    simple?: boolean;
}
