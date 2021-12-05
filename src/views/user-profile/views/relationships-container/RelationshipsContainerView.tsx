import { RelationshipStatusEnum, RelationshipStatusInfo } from '@nitrots/nitro-renderer';
import { FC, useCallback } from 'react';
import { GetUserProfile, LocalizeText } from '../../../../api';
import { AvatarImageView } from '../../../shared/avatar-image/AvatarImageView';
import { RelationshipsContainerViewProps } from './RelationshipsContainerView.types';

export const RelationshipsContainerView: FC<RelationshipsContainerViewProps> = props =>
{
    const { relationships = null, simple = false } = props;

    const OnUserClick = useCallback((user: RelationshipStatusInfo) =>
    {
        if(!user) return;

        GetUserProfile(user.randomFriendId);
    }, []);

    const RelationshipComponent = useCallback(({ type }) =>
    {
        const relationshipInfo = (relationships && relationships.relationshipStatusMap.hasKey(type)) ? relationships.relationshipStatusMap.getValue(type) : null;

        if(simple && !relationshipInfo) return null;

        const relationshipName = RelationshipStatusEnum.RELATIONSHIP_NAMES[type].toLocaleLowerCase();

        return (
            <div className="relationship-container d-flex flex-row align-items-center w-100">
                <i className={`nitro-friends-spritesheet icon-${relationshipName} flex-shrink-0 align-self-baseline mt-2`} />
                <div className="w-100 d-flex flex-column">
                    <span className={'relationship mx-2' + (!simple ? ' advanced' : '')}>
                        <span className="cursor-pointer relationship-text" onClick={ event => OnUserClick(relationshipInfo)}>
                            {
                                (relationshipInfo && relationshipInfo.friendCount > 0) ? relationshipInfo.randomFriendName : LocalizeText('extendedprofile.add.friends')
                            }
                        </span> 
                        {
                            (simple && relationshipInfo && relationshipInfo.friendCount > 1) &&
                            <span>
                                {' ' + LocalizeText(`extendedprofile.relstatus.others.${relationshipName}`, ['count'], [(relationshipInfo.friendCount - 1).toString()])}
                            </span>
                        }
                        {
                            (!simple && relationshipInfo && relationshipInfo.friendCount > 0) &&
                            <AvatarImageView figure={relationshipInfo.randomFriendFigure} headOnly={true} direction={4} />
                        }
                    </span>

                    {
                        !simple && <div className="others-text">
                            {
                                (relationshipInfo && relationshipInfo.friendCount > 1) ? LocalizeText(`extendedprofile.relstatus.others.${relationshipName}`, ['count'], [(relationshipInfo.friendCount - 1).toString()]) : ''
                            }
                            {
                                (relationshipInfo && relationshipInfo.friendCount < 1) ? LocalizeText('extendedprofile.no.friends.in.this.category') : ''
                            }
                        </div>
                    }
                </div>
            </div>
        );
    }, [OnUserClick, relationships, simple]);

    return (
        <div className="row justify-content-center relationships-container align-items-center flex-fill">
            <RelationshipComponent type={RelationshipStatusEnum.HEART} />
            <RelationshipComponent type={RelationshipStatusEnum.SMILE} />
            <RelationshipComponent type={RelationshipStatusEnum.BOBBA} />
        </div>
    );
}
