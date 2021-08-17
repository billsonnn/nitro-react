import { RelationshipStatusEnum, RelationshipStatusInfo, UserProfileComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback } from 'react';
import { LocalizeText } from '../../../../api';
import { SendMessageHook } from '../../../../hooks';
import { AvatarImageView } from '../../../shared/avatar-image/AvatarImageView';
import { RelationshipsContainerViewProps } from './RelationshipsContainerView.types';

export const RelationshipsContainerView: FC<RelationshipsContainerViewProps> = props =>
{
    const { relationships = null, simple = false } = props;

    const OnUserClick = useCallback((user: RelationshipStatusInfo) =>
    {
        if(user)
            SendMessageHook(new UserProfileComposer(user.randomFriendId));
    }, []);

    const RelationshipComponent = useCallback(({ type }) =>
    {
        const relationshipInfo = (relationships && relationships.relationshipStatusMap.hasKey(type)) ? relationships.relationshipStatusMap.getValue(type) : null;

        if(simple && !relationshipInfo) return null;

        const relationshipName = RelationshipStatusEnum.RELATIONSHIP_NAMES[type].toLocaleLowerCase();

        return (
            <div className="relationship-container row row-cols-2 d-flex align-items-center">
                <i className={`icon icon-relationship-${relationshipName} col-2`} />
                <span className={'relationship col-10' + (!simple ? ' advanced' : '')}>
                    <span className="cursor-pointer relationship-text" onClick={() => OnUserClick(relationshipInfo)}>
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
