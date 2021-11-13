import { GroupRemoveMemberComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback } from 'react';
import { CreateLinkEvent, GetSessionDataManager, LocalizeText, TryVisitRoom } from '../../../../api';
import { GetGroupManager } from '../../../../api/groups/GetGroupManager';
import { GetGroupMembers } from '../../../../api/groups/GetGroupMembers';
import { TryJoinGroup } from '../../../../api/groups/TryJoinGroup';
import { SendMessageHook } from '../../../../hooks';
import { CatalogPageName } from '../../../catalog/common/CatalogPageName';
import { BadgeImageView } from '../../../shared/badge-image/BadgeImageView';
import { GroupMembershipType } from '../../common/GroupMembershipType';
import { GroupType } from '../../common/GroupType';
import { GroupInformationViewProps } from './GroupInformationView.types';

export const GroupInformationView: FC<GroupInformationViewProps> = props =>
{
    const { groupInformation = null, onClose = null } = props;    

    const joinGroup = useCallback(() =>
    {
        if(!groupInformation) return;

        TryJoinGroup(groupInformation.id);
    }, [ groupInformation ]);

    const leaveGroup = useCallback(() =>
    {
        if(window.confirm(LocalizeText('group.leaveconfirm.desc')))
        {
            SendMessageHook(new GroupRemoveMemberComposer(groupInformation.id, GetSessionDataManager().userId));
            if(onClose) onClose();
        }       
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

        if(groupInformation.membershipType === GroupMembershipType.MEMBER) return leaveGroup();

        return joinGroup();
    }, [ groupInformation, leaveGroup, joinGroup ]);

    const handleAction = useCallback((action: string) =>
    {
        switch(action)
        {
            case 'members':
                GetGroupMembers(groupInformation.id);
                break;
            case 'members_pending':
                GetGroupMembers(groupInformation.id, 2);
                break;
            case 'manage':
                GetGroupManager(groupInformation.id);
                break;
            case 'homeroom':
                TryVisitRoom(groupInformation.roomId);
                break;
            case 'furniture':
                CreateLinkEvent('catalog/open/' + CatalogPageName.GUILD_CUSTOM_FURNI);
                break;
        }
    }, [ groupInformation, onClose ]);
    
    if(!groupInformation) return null;

    return (
        <div className="group-information text-black p-2">
            <div>
                <div className="text-center d-flex flex-column h-100 small text-black text-decoration-underline">
                    <div className="group-badge d-flex align-items-center">
                        <BadgeImageView badgeCode={ groupInformation.badge } isGroup={ true } className="mx-auto d-block"/>
                    </div>
                    <div className="mt-3 cursor-pointer" onClick={ () => handleAction('members') }>
                        { LocalizeText('group.membercount', ['totalMembers'], [groupInformation.membersCount.toString()]) }
                    </div>
                    { groupInformation.pendingRequestsCount > 0 && <div className="cursor-pointer" onClick={ () => handleAction('members_pending') }>
                        { LocalizeText('group.pendingmembercount', ['amount'], [groupInformation.pendingRequestsCount.toString()]) }
                    </div> }
                    { groupInformation.isOwner && <div className="cursor-pointer" onClick={ () => handleAction('manage') }>
                        { LocalizeText('group.manage') }
                    </div> }
                    <div className="mt-auto mb-1">
                        { getRoleIcon() }
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
                <div className="small text-black text-decoration-underline">
                    <div className="cursor-pointer" onClick={ () => handleAction('homeroom') }>
                        { LocalizeText('group.linktobase') }
                    </div>
                    <div className="cursor-pointer" onClick={ () => handleAction('furniture') }>
                        { LocalizeText('group.buyfurni') }
                    </div>
                    <div className="cursor-pointer">
                        { LocalizeText('group.showgroups') }
                    </div>
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
