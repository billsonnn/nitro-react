import { RelationshipStatusEnum, RelationshipStatusInfoMessageParser } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { GetUserProfile, LocalizeText } from '../../../api';
import { Flex, LayoutAvatarImageView, Text } from '../../../common';

interface RelationshipsContainerViewProps
{
    relationships: RelationshipStatusInfoMessageParser;
}

interface RelationshipsContainerRelationshipViewProps
{
    type: number;
}

export const RelationshipsContainerView: FC<RelationshipsContainerViewProps> = props =>
{
    const { relationships = null } = props;

    const RelationshipComponent = ({ type }: RelationshipsContainerRelationshipViewProps) =>
    {
        const relationshipInfo = (relationships && relationships.relationshipStatusMap.hasKey(type)) ? relationships.relationshipStatusMap.getValue(type) : null;
        const relationshipName = RelationshipStatusEnum.RELATIONSHIP_NAMES[type].toLocaleLowerCase();

        return (
            <div className="flex w-full gap-1">
                <Flex center className="user-relationship">
                    <i className={`nitro-friends-spritesheet icon-${relationshipName}`} />
                </Flex>
                <div className="flex flex-col flex-grow-1 gap-0">
                    <Flex alignItems="center" className="bg-white rounded px-2 py-1 user-relationship" justifyContent="between">
                        <Text pointer small underline onClick={event => (relationshipInfo && (relationshipInfo.randomFriendId >= 1) && GetUserProfile(relationshipInfo.randomFriendId))}>
                            {(!relationshipInfo || (relationshipInfo.friendCount === 0)) &&
                                LocalizeText('extendedprofile.add.friends')}
                            {(relationshipInfo && (relationshipInfo.friendCount >= 1)) &&
                                relationshipInfo.randomFriendName}
                        </Text>
                        {(relationshipInfo && (relationshipInfo.friendCount >= 1)) &&
                            <div className="flex items-center justify-center avatar-image-container p-relative">
                                <LayoutAvatarImageView direction={4} figure={relationshipInfo.randomFriendFigure} headOnly={true} />
                            </div>}
                    </Flex>
                    <Text italics small className="user-relationship-count">
                        {(!relationshipInfo || (relationshipInfo.friendCount === 0)) &&
                            LocalizeText('extendedprofile.no.friends.in.this.category')}
                        {(relationshipInfo && (relationshipInfo.friendCount > 1)) &&
                            LocalizeText(`extendedprofile.relstatus.others.${relationshipName}`, ['count'], [(relationshipInfo.friendCount - 1).toString()])}
                        &nbsp;
                    </Text>
                </div>
            </div>
        );
    }

    return (
        <>
            <RelationshipComponent type={RelationshipStatusEnum.HEART} />
            <RelationshipComponent type={RelationshipStatusEnum.SMILE} />
            <RelationshipComponent type={RelationshipStatusEnum.BOBBA} />
        </>
    );
}
