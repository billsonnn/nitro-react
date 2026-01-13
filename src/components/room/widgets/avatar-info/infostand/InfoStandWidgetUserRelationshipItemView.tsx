import { RelationshipStatusEnum, RelationshipStatusInfo } from "@nitrots/nitro-renderer"
import { FC } from "react"
import { GetUserProfile, LocalizeText } from "../../../../../api"

interface InfoStandWidgetUserRelationshipsRelationshipItemViewProps
{
    type: number;
    relationship: RelationshipStatusInfo;
}

export const InfoStandWidgetUserRelationshipsRelationshipItemView: FC<InfoStandWidgetUserRelationshipsRelationshipItemViewProps> = props =>
{
    const { type = -1, relationship = null } = props

    if(!relationship) return <div className="h-4" />

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

    return (
        <div className="mb-[5px] flex h-4 items-center gap-1">
            <i className={`h-3.5 w-[13px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] ${ getUserRelationshipPosition() }`} />
            <p className="text-sm !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]" onClick={ event => GetUserProfile(relationship.randomFriendId) }>
                <u className="cursor-pointer">{ relationship.randomFriendName }</u>
                { (relationship.friendCount > 1) && (" " + LocalizeText(`extendedprofile.relstatus.others.${ relationshipName }`, [ "count" ], [ (relationship.friendCount - 1).toString() ])) }
            </p>
        </div>
    )
}
