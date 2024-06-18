import { RelationshipStatusEnum, RelationshipStatusInfoMessageParser } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { InfoStandWidgetUserRelationshipsRelationshipItemView } from './InfoStandWidgetUserRelationshipItemView';

interface InfoStandWidgetUserRelationshipsViewProps
{
    relationships: RelationshipStatusInfoMessageParser;
}

export const InfoStandWidgetUserRelationshipsView: FC<InfoStandWidgetUserRelationshipsViewProps> = props =>
{
    const { relationships = null } = props;

    if(!relationships || !relationships.relationshipStatusMap.length) return null;

    return (
        <>
            <InfoStandWidgetUserRelationshipsRelationshipItemView relationship={ relationships.relationshipStatusMap.getValue(RelationshipStatusEnum.HEART) } type={ RelationshipStatusEnum.HEART } />
            <InfoStandWidgetUserRelationshipsRelationshipItemView relationship={ relationships.relationshipStatusMap.getValue(RelationshipStatusEnum.SMILE) } type={ RelationshipStatusEnum.SMILE } />
            <InfoStandWidgetUserRelationshipsRelationshipItemView relationship={ relationships.relationshipStatusMap.getValue(RelationshipStatusEnum.BOBBA) } type={ RelationshipStatusEnum.BOBBA } />
        </>
    );
};
