import { FriendlyTime } from '@nitrots/nitro-renderer';
import { FC, useCallback } from 'react';
import { GetSessionDataManager, LocalizeText } from '../../../../api';
import { AvatarImageView } from '../../../shared/avatar-image/AvatarImageView';
import { UserContainerViewProps } from './UserContainerView.types';

export const UserContainerView: FC<UserContainerViewProps> = props =>
{
    const { figure = null, username = null, motto = null, creation = null, secondsSinceLastLogin = null, achievementScore, isFriend = null, isOnline = null, id = null, requestSent = null } = props;

    const OnlineIcon = useCallback(() => 
{
        if(isOnline) return (<i className="icon icon-pf-online" />);
        else return (<i className="icon icon-pf-offline" />);
    }, [isOnline]);

    const FriendRequestComponent = useCallback(() => 
{
        if(id === GetSessionDataManager().userId) return (<span><i className="icon icon-pf-tick" />{LocalizeText('extendedprofile.me')}</span> );

        if(isFriend) return (<span><i className="icon icon-pf-tick" />{LocalizeText('extendedprofile.friend')}</span>);

        if(requestSent) return (<span><i className="icon icon-pf-tick" />{LocalizeText('extendedprofile.friendrequestsent')}</span>);

        return (<button className="btn btn-success btn-sm add-friend">{LocalizeText('extendedprofile.addasafriend')}</button>)
    }, [id, isFriend, requestSent]);

    return (
        <div className="row">
            <div className="col-sm-3 px-0 d-flex align-items-center">
                <AvatarImageView figure={figure} direction={2} />
            </div>
            <div className="col-sm-8">
                <div className="user-info-container">
                    <div className="fw-bold">{username}</div>
                    <div className="mb-1 fst-italic">{motto}</div>
                    <div className="mb-1" dangerouslySetInnerHTML={{ __html: LocalizeText('extendedprofile.created', ['created'], [creation]) }} />
                    <div className="mb-1" dangerouslySetInnerHTML={{ __html: LocalizeText('extendedprofile.last.login', ['lastlogin'], [FriendlyTime.format(secondsSinceLastLogin, '.ago', 2)]) }} />
                    <div className="mb-1"><b>{LocalizeText('extendedprofile.achievementscore')}</b> {achievementScore}</div>
                    <div className="d-flex flex-row align-items-center">
                        <OnlineIcon />
                        <FriendRequestComponent />
                    </div>
                </div>
            </div>
        </div>
    )
}
