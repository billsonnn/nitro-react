import { FC } from "react"
import { LayoutBadgeImageView } from "../../../common"

interface BadgesContainerViewProps
{
    badges: string[];
    isShadow?: boolean;
}

export const BadgesContainerView: FC<BadgesContainerViewProps> = props =>
{
    const { badges = null, isShadow = false, ...rest } = props

    return (
        <>
            { badges && (badges.length > 0) && badges.map((badge, index) => (
                <div key={ badge } className="flex flex-col" >
                    <LayoutBadgeImageView key={ badge } badgeCode={ badge } isShadow={ isShadow } />
                </div>
            ))}
        </>
    )
}
