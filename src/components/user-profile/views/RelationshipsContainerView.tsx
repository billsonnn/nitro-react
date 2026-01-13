import { RelationshipStatusEnum, RelationshipStatusInfoMessageParser } from "@nitrots/nitro-renderer"
import { FC } from "react"
import { GetUserProfile, LocalizeText } from "../../../api"
import { LayoutAvatarImageView } from "../../../common"

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
    const { relationships = null } = props

    const RelationshipComponent = ({ type }: RelationshipsContainerRelationshipViewProps) =>
    {
        const relationshipInfo = (relationships && relationships.relationshipStatusMap.hasKey(type)) ? relationships.relationshipStatusMap.getValue(type) : null
        const relationshipName = RelationshipStatusEnum.RELATIONSHIP_NAMES[type].toLocaleLowerCase()

        const getUserRelationshipPosition = () =>
        {
            let position = "bg-[0px_0px]"

            if(relationshipName === "heart")
            {
                position = "bg-[-292px_-23px]"
            }
            else if(relationshipName === "smile")
            {
                position = "bg-[-320px_-23px]"
            }
            else if(relationshipName === "bobba")
            {
                position = "bg-[-306px_-23px]"
            }

            return position
        }

        if(relationshipInfo) return (
            <div className="mb-2.5 flex w-full cursor-pointer flex-col" onClick={ event => (relationshipInfo && (relationshipInfo.randomFriendId >= 1) && GetUserProfile(relationshipInfo.randomFriendId)) }>
                <div className="flex items-center gap-1.5">
                    <i className={ `h-3.5 w-[13px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] ${ getUserRelationshipPosition() }` } />
                    <div className="illumina-profile-relationship top-0 flex h-[22px] w-full items-center justify-between">
                        <p className="pl-[9px] text-[11px] font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">
                            { (relationshipInfo && (relationshipInfo.friendCount >= 1)) &&
                                relationshipInfo.randomFriendName }
                        </p>
                        { (relationshipInfo && (relationshipInfo.friendCount >= 1)) && <LayoutAvatarImageView className="!bottom-0 !size-[50px] !bg-[-20px_-31px]" figure={ relationshipInfo.randomFriendFigure } headOnly={ true } direction={ 4 } /> }
                    </div>
                </div>
                <p className="pl-[27px] text-[11px] italic text-[#838383]">
                    { (relationshipInfo && (relationshipInfo.friendCount > 1)) &&
                        LocalizeText(`extendedprofile.relstatus.others.${ relationshipName }`, [ "count" ], [ (relationshipInfo.friendCount - 1).toString() ]) }
                    &nbsp;
                </p>
            </div>
        )
    }

    return (
        <>
            <RelationshipComponent type={ RelationshipStatusEnum.HEART } />
            <RelationshipComponent type={ RelationshipStatusEnum.SMILE } />
            <RelationshipComponent type={ RelationshipStatusEnum.BOBBA } />
        </>
    )
}
