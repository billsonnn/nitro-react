import { FC } from 'react';
import { NitroCardGridItemView, NitroCardGridView } from '../../../layout';
import { BadgeImageView } from '../../../views/shared/badge-image/BadgeImageView';

interface BadgesContainerViewProps
{
    badges: string[];
}

export const BadgesContainerView: FC<BadgesContainerViewProps> = props =>
{
    const { badges = null } = props;

    return (
        <div className="row">
            <NitroCardGridView>
                { badges && (badges.length > 0) && badges.map((badge, index) =>
                        {
                            return (
                                <NitroCardGridItemView key={ index }>
                                    <BadgeImageView badgeCode={ badge }/>
                                </NitroCardGridItemView>
                            )
                        }) }
            </NitroCardGridView>
        </div>
    )
}
