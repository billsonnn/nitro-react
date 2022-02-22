import { FriendlyTime, UserProfileParser } from '@nitrots/nitro-renderer';
import { FC, useCallback } from 'react';
import { GetSessionDataManager, LocalizeText } from '../../../api';
import { AvatarImageView } from '../../../views/shared/avatar-image/AvatarImageView';

interface UserContainerViewProps
{
    userProfile: UserProfileParser;
}

export const UserContainerView: FC<UserContainerViewProps> = props =>
{
    const { userProfile = null } = props;

    const OnlineIcon = useCallback(() => 
{
        if(userProfile.isOnline) return (<i className="icon icon-pf-online" />);
        else return (<i className="icon icon-pf-offline" />);
    }, [ userProfile ]);

    const FriendRequestComponent = useCallback(() => 
{
        if(userProfile.id === GetSessionDataManager().userId) return (<span><i className="icon icon-pf-tick" />{LocalizeText('extendedprofile.me')}</span> );

        if(userProfile.isMyFriend) return (<span><i className="icon icon-pf-tick" />{LocalizeText('extendedprofile.friend')}</span>);

        if(userProfile.requestSent) return (<span><i className="icon icon-pf-tick" />{LocalizeText('extendedprofile.friendrequestsent')}</span>);

        return (<button className="btn btn-success btn-sm add-friend">{LocalizeText('extendedprofile.addasafriend')}</button>)
    }, [ userProfile ]);

    return (
        <div className="row">
            <div className="col-auto px-0 d-flex align-items-center">
                <AvatarImageView figure={userProfile.figure} direction={2} />
            </div>
            <div className="col">
                <div className="user-info-container">
                    <div className="fw-bold">{userProfile.username}</div>
                    <div className="fst-italic text-break small">{userProfile.motto}</div>
                    <div dangerouslySetInnerHTML={{ __html: LocalizeText('extendedprofile.created', ['created'], [userProfile.registration]) }} />
                    <div dangerouslySetInnerHTML={{ __html: LocalizeText('extendedprofile.last.login', ['lastlogin'], [FriendlyTime.format(userProfile.secondsSinceLastVisit, '.ago', 2)]) }} />
                    <div><b>{LocalizeText('extendedprofile.achievementscore')}</b> {userProfile.achievementPoints}</div>
                    <div className="d-flex flex-row align-items-center gap-2">
                        <OnlineIcon />
                        <FriendRequestComponent />
                    </div>
                </div>
            </div>
        </div>
    )
}
