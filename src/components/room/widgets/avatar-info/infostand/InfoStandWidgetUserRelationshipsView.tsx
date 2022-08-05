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
            <InfoStandWidgetUserRelationshipsRelationshipItemView type={ RelationshipStatusEnum.HEART } relationship={ relationships.relationshipStatusMap.getValue(RelationshipStatusEnum.HEART) } />
            <InfoStandWidgetUserRelationshipsRelationshipItemView type={ RelationshipStatusEnum.SMILE } relationship={ relationships.relationshipStatusMap.getValue(RelationshipStatusEnum.SMILE) } />
            <InfoStandWidgetUserRelationshipsRelationshipItemView type={ RelationshipStatusEnum.BOBBA } relationship={ relationships.relationshipStatusMap.getValue(RelationshipStatusEnum.BOBBA) } />
        </>
    );
}
