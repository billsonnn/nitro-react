import { UserProfileComposer, UserRelationshipDataParser } from '@nitrots/nitro-renderer';
import { FC, useCallback } from 'react';
import { SendMessageHook } from '../../../../hooks';
import { LocalizeText } from '../../../../utils';
import { AvatarImageView } from '../../../shared/avatar-image/AvatarImageView';
import { FriendsContainerViewProps } from './FriendsContainerView.types';

export const FriendsContainerView: FC<FriendsContainerViewProps> = props => 
{
    const { relationships = null, friendsCount = null } = props;

    const OnUserClick = useCallback((user: UserRelationshipDataParser) =>
    {
        if(user)
            SendMessageHook(new UserProfileComposer(user.userId));
    }, []);
    
    const RelationshipComponent = useCallback(({ type }) =>
    {
        const randomUserIndex = (relationships && relationships.has(type) && relationships.get(type).length) ?
            Math.floor(Math.random() * relationships.get(type).length) : -1;

        const randomUser = randomUserIndex > -1 ? relationships.get(type)[randomUserIndex] : null;

        return (
            <div className="relationship-container d-flex">
                <i className={`icon icon-relationship-${type}`} />
                <span className="relationship">
                    <span className="relationship-text" onClick={() => OnUserClick(randomUser)}>
                        {
                            randomUser ? randomUser.username : LocalizeText('extendedprofile.add.friends')
                        }
                    </span>
                    {
                        randomUser &&
                        <AvatarImageView figure={randomUser.figure} headOnly={true} direction={4} />
                    }
                </span>
            </div>
        );
    }, [OnUserClick, relationships]);

    return (
        <div className="friends-container">
            <div className="mb-1" dangerouslySetInnerHTML={{ __html: LocalizeText('extendedprofile.friends.count', ['count'], [friendsCount.toString()]) }} />
            <div className="mb-1"><b>{LocalizeText('extendedprofile.relstatus')}</b></div>
            <div className="row justify-content-center relationships-container align-items-center">
                <RelationshipComponent type={'heart'} />
                <RelationshipComponent type={'smile'} />
                <RelationshipComponent type={'bobba'} />
            </div>
        </div>
    )
}
