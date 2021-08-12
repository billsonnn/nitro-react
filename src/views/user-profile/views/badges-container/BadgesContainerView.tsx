import { FC } from 'react';
import { BadgeImageView } from '../../../shared/badge-image/BadgeImageView';
import { BadgesContainerViewProps } from './BadgesContainerView.types';

export const BadgesContainerView: FC<BadgesContainerViewProps> = props =>
{
    const {badges = null} = props;

    return (
        <div className="row badge-container">
            <div className="col-sm-12 d-flex">
                {
                    badges.map( (badge, index) => {
                        return <BadgeImageView badgeCode={badge} key={index}/>
                    })
                }
            </div>
        </div>
    );
}
