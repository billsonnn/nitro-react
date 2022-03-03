import { FC } from 'react';
import { Grid, LayoutBadgeImageView, LayoutGridItem } from '../../../common';

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
                                    <LayoutBadgeImageView badgeCode={ badge }/>
                                </LayoutGridItem>
                            )
                        }) }
            </Grid>
        </div>
    )
}
