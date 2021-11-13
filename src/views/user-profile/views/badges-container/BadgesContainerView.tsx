import { FC } from 'react';
import { NitroCardGridItemView, NitroCardGridView } from '../../../../layout';
import { BadgeImageView } from '../../../shared/badge-image/BadgeImageView';
import { BadgesContainerViewProps } from './BadgesContainerView.types';

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
