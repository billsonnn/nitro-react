import { GroupDeleteComposer, GroupInformationComposer, GroupJoinComposer, GroupRemoveMemberComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback } from 'react';
import { CreateLinkEvent, GetSessionDataManager, LocalizeText, TryVisitRoom } from '../../../../api';
import { SendMessageHook } from '../../../../hooks';
import { CatalogPageName } from '../../../catalog/common/CatalogPageName';
import { BadgeImageView } from '../../../shared/badge-image/BadgeImageView';
import { GroupMembershipType } from '../../common/GroupMembershipType';
import { GroupType } from '../../common/GroupType';
import { GroupInformationViewProps } from './GroupInformationView.types';

export const GroupInformationView: FC<GroupInformationViewProps> = props =>
{
    const { groupInformation = null, onClose = null } = props;    

    const tryJoinGroup = useCallback(() =>
    {
        if(!groupInformation) return;

        SendMessageHook(new GroupJoinComposer(groupInformation.id));
        SendMessageHook(new GroupInformationComposer(groupInformation.id, false));
    }, [ groupInformation ]);

    const tryLeaveGroup = useCallback(() =>
    {
        SendMessageHook(new GroupRemoveMemberComposer(groupInformation.id, GetSessionDataManager().userId));
        SendMessageHook(new GroupInformationComposer(groupInformation.id, false));
        if(onClose) onClose();
    }, [ groupInformation, onClose ]);

    const isRealOwner = useCallback(() =>
    {
        if(!groupInformation) return false;

        return (groupInformation.ownerName === GetSessionDataManager().userName);
    }, [ groupInformation ]);

    const getRoleIcon = useCallback(() =>
    {
        if(groupInformation.membershipType === GroupMembershipType.NOT_MEMBER || groupInformation.membershipType === GroupMembershipType.REQUEST_PENDING) return null;

        if(isRealOwner()) return <i className="icon icon-group-owner" title={ LocalizeText('group.youareowner') } />;

        if(groupInformation.isAdmin) return <i className="icon icon-group-admin" title={ LocalizeText('group.youareadmin') } />;

        return <i className="icon icon-group-member" title={ LocalizeText('group.youaremember') } />;
    }, [ groupInformation, isRealOwner ]);

    const getButtonText = useCallback(() =>
    {
        if(groupInformation.type === GroupType.PRIVATE) return '';

        if(isRealOwner()) return 'group.youareowner';

        if(groupInformation.membershipType === GroupMembershipType.MEMBER) return 'group.leave';

        if(groupInformation.membershipType === GroupMembershipType.NOT_MEMBER && groupInformation.type === GroupType.REGULAR) return 'group.join';

        if(groupInformation.type === GroupType.EXCLUSIVE)
        {
            if(groupInformation.membershipType === GroupMembershipType.NOT_MEMBER) return 'group.requestmembership';

            if(groupInformation.membershipType === GroupMembershipType.REQUEST_PENDING) return 'group.membershippending';
        }
    }, [ groupInformation, isRealOwner ]);

    const handleButtonClick = useCallback(() =>
    {
        if(groupInformation.type === GroupType.PRIVATE && groupInformation.membershipType === GroupMembershipType.NOT_MEMBER) return;

        if(groupInformation.membershipType === GroupMembershipType.MEMBER) return tryLeaveGroup();

        return tryJoinGroup();
    }, [ groupInformation, tryLeaveGroup, tryJoinGroup ]);

    const handleAction = useCallback((action: string) =>
    {
        switch(action)
        {
            case 'homeroom':
                TryVisitRoom(groupInformation.roomId);
                break;
            case 'furniture':
                CreateLinkEvent('catalog/open/' + CatalogPageName.GUILD_CUSTOM_FURNI);
                break;
            case 'delete':
                if(window.confirm(LocalizeText('group.deleteconfirm.title') + ' - ' + LocalizeText('group.deleteconfirm.desc')))
                {
                    SendMessageHook(new GroupDeleteComposer(groupInformation.id));
                    if(onClose) onClose();
                }
                break;
        }
    }, [ groupInformation, onClose ]);
    
    if(!groupInformation) return null;

    return (
        <div className="group-information text-black p-2">
            <div>
                <div className="group-badge text-center">
                    <BadgeImageView badgeCode={ groupInformation.badge } isGroup={ true } />
                    <div className="mt-3">
                        <a href="#" className="small text-black">
                            { LocalizeText('group.membercount', ['totalMembers'], [groupInformation.membersCount.toString()]) }
                        </a>
                    </div>
                    <div>
                        { groupInformation.pendingRequestsCount > 0 && <a href="#" className="small text-black">
                            { LocalizeText('group.pendingmembercount', ['totalMembers'], [groupInformation.pendingRequestsCount.toString()]) }
                        </a> }
                    </div>
                    <div className="mt-3">
                        { getRoleIcon() }
                    </div>
                    <div>
                        { groupInformation.isOwner && <a href="#" className="small text-danger" onClick={ () => handleAction('delete') }>
                            { LocalizeText('group.delete') }
                        </a> }
                    </div>
                </div>
            </div>
            <div className="ms-2 w-100">
                <div className="fw-bold d-flex align-items-center">
                    <i className={ 'icon icon-group-type-' + groupInformation.type } />
                    { groupInformation.canMembersDecorate && <i className="icon icon-group-decorate ms-1" /> }
                    <div className="ms-1">{ groupInformation.title }</div>
                </div>
                <div>{ LocalizeText('group.created', ['date', 'owner'], [groupInformation.createdAt, groupInformation.ownerName]) }</div>
                <div className="group-description small overflow-auto">{ groupInformation.description }</div>
                <div>
                    <a href="#" className="small text-black" onClick={ () => handleAction('homeroom') }>
                        { LocalizeText('group.linktobase') }
                    </a>
                </div>
                <div>
                    <a href="#" className="small text-black" onClick={ () => handleAction('furniture') }>
                        { LocalizeText('group.buyfurni') }
                    </a>
                </div>
                <div>
                    <a href="#" className="small text-black">
                        { LocalizeText('group.showgroups') }
                    </a>
                </div>
                { groupInformation.type !== GroupType.PRIVATE && 
                    <button className="btn btn-primary w-100 mt-2" disabled={ groupInformation.membershipType === GroupMembershipType.REQUEST_PENDING || isRealOwner() } onClick={ handleButtonClick }>
                        { LocalizeText(getButtonText()) }
                    </button>
                }
            </div>
        </div>
    );
};
