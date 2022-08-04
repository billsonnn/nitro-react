import { FC } from 'react';
import { Column, FlexProps, LayoutBadgeImageView } from '../../../common';

interface BadgesContainerViewProps extends FlexProps
{
    badges: string[];
}

export const BadgesContainerView: FC<BadgesContainerViewProps> = props =>
{
    const { badges = null, gap = 1, justifyContent = 'between', ...rest } = props;

    return (
        <>
            { badges && (badges.length > 0) && badges.map((badge, index) =>
            {
                return (
                    <Column key={ badge } center>
                        <LayoutBadgeImageView key={ badge } badgeCode={ badge } />
                    </Column>
                );
            }) }
        </>
    );
}
