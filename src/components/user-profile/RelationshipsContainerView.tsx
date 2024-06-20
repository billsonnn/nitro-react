import { RelationshipStatusEnum, RelationshipStatusInfoMessageParser } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { GetUserProfile, LocalizeText } from '../../api';
import { Flex, LayoutAvatarImageView } from '../../common';

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
                <Flex center className="h-[25px]">
                    <i className={ `nitro-friends-spritesheet icon-${ relationshipName }` } />
                </Flex>
                <div className="flex flex-col flex-grow gap-0">
                    <div className="flex items-center justify-between bg-white rounded px-2 py-1 h-[25px]">
                        <p className="text-sm underline pointer" onClick={ event => (relationshipInfo && (relationshipInfo.randomFriendId >= 1) && GetUserProfile(relationshipInfo.randomFriendId)) }>
                            { (!relationshipInfo || (relationshipInfo.friendCount === 0)) &&
                                LocalizeText('extendedprofile.add.friends') }
                            { (relationshipInfo && (relationshipInfo.friendCount >= 1)) &&
                                relationshipInfo.randomFriendName }
                        </p>
                        { (relationshipInfo && (relationshipInfo.friendCount >= 1)) &&
                            <div className="flex items-center justify-center w-[50px] h-[50px] top-[20px] -right-[8px] relative">
                                <LayoutAvatarImageView direction={ 4 } figure={ relationshipInfo.randomFriendFigure } headOnly={ true } />
                            </div> }
                    </div>
                    <p className="italics text-sm mt-[2px] ml-[5px] !text-[#939392]">
                        { (!relationshipInfo || (relationshipInfo.friendCount === 0)) &&
                            LocalizeText('extendedprofile.no.friends.in.this.category') }
                        { (relationshipInfo && (relationshipInfo.friendCount > 1)) &&
                            LocalizeText(`extendedprofile.relstatus.others.${ relationshipName }`, [ 'count' ], [ (relationshipInfo.friendCount - 1).toString() ]) }
                        &nbsp;
                    </p>
                </div>
            </div>
        );
    };

    return (
        <>
            <RelationshipComponent type={ RelationshipStatusEnum.HEART } />
            <RelationshipComponent type={ RelationshipStatusEnum.SMILE } />
            <RelationshipComponent type={ RelationshipStatusEnum.BOBBA } />
        </>
    );
};
