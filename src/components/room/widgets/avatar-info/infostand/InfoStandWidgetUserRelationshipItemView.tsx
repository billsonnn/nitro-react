import { RelationshipStatusEnum, RelationshipStatusInfo } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { GetUserProfile, LocalizeText } from '../../../../../api';
import { Flex, Text } from '../../../../../common';

interface InfoStandWidgetUserRelationshipsRelationshipItemViewProps
{
    type: number;
    relationship: RelationshipStatusInfo;
}

export const InfoStandWidgetUserRelationshipsRelationshipItemView: FC<InfoStandWidgetUserRelationshipsRelationshipItemViewProps> = props =>
{
    const { type = -1, relationship = null } = props;

    if(!relationship) return null;

    const relationshipName = RelationshipStatusEnum.RELATIONSHIP_NAMES[type].toLocaleLowerCase();

    return (
        <Flex alignItems="center" gap={ 1 }>
            <i className={ `nitro-friends-spritesheet icon-${ relationshipName }` } />
            <Flex alignItems="center" gap={ 0 }>
                <Text small variant="white" onClick={ event => GetUserProfile(relationship.randomFriendId) }>
                    <u>{ relationship.randomFriendName }</u>
                    { (relationship.friendCount > 1) && (' ' + LocalizeText(`extendedprofile.relstatus.others.${ relationshipName }`, [ 'count' ], [ (relationship.friendCount - 1).toString() ])) }
                </Text>
            </Flex>
        </Flex>
    );
}
