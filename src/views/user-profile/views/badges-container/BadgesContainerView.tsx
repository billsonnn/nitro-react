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

//     return (
//         <div className="row badge-container d-flex mt-1">
//             <div className="nitro-card-grid theme-default">
//                 <div className="row row-cols-5 align-content-start">
//                 {
//                     badges.map( (badge, index) => 
// {
//                         return (
//                         <div className="grid-item-container" key={index}>
//                             <BadgeImageView badgeCode={badge}/>
//                         </div>
//                         )
//                     })
//                 }
//                 </div>
//             </div>
//         </div>
//     );
}
