import { FC } from 'react';
import { Grid, LayoutGridItem } from '../../../common';
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
            <Grid>
                { badges && (badges.length > 0) && badges.map((badge, index) =>
                        {
                            return (
                                <LayoutGridItem key={ index }>
                                    <BadgeImageView badgeCode={ badge }/>
                                </LayoutGridItem>
                            )
                        }) }
            </Grid>
        </div>
    )
}
