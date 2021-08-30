import { GroupInformationComposer, GroupInformationEvent, GroupInformationParser, GroupJoinComposer, GroupRemoveMemberComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { GetSessionDataManager, LocalizeText } from '../../../../api';
import { CreateMessageHook, SendMessageHook } from '../../../../hooks';
import { BadgeImageView } from '../../../shared/badge-image/BadgeImageView';
import { GroupMembershipType } from '../../common/GroupMembershipType';
import { GroupType } from '../../common/GroupType';
import { GroupInformationViewProps } from './GroupInformationView.types';

export const GroupInformationView: FC<GroupInformationViewProps> = props =>
{
    const { group = null, onLeaveGroup = null } = props;

    const [ groupInformation, setGroupInformation ] = useState<GroupInformationParser>(null);

    useEffect(() =>
    {
        setGroupInformation(null);
        if(group) SendMessageHook(new GroupInformationComposer(group.id, false));
    }, [ group ]);

    const onGroupInformationEvent = useCallback((event: GroupInformationEvent) =>
    {
        const parser = event.getParser();

        if(groupInformation) setGroupInformation(null);

        setGroupInformation(parser);
    }, [ groupInformation ]);

    CreateMessageHook(GroupInformationEvent, onGroupInformationEvent);

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
        if(onLeaveGroup) onLeaveGroup();
    }, [ groupInformation, onLeaveGroup ]);

    const isOwner = useCallback(() =>
    {
        if(!group) return false;

        return (group.ownerId === GetSessionDataManager().userId);
    }, [ group, groupInformation ]);

    const getRoleIcon = useCallback(() =>
    {
        if(groupInformation.membershipType === GroupMembershipType.NOT_MEMBER || groupInformation.membershipType === GroupMembershipType.REQUEST_PENDING) return null;

        if(isOwner()) return <i className="icon icon-group-owner" title={ LocalizeText('group.youareowner') } />;

        if(groupInformation.isAdmin) return <i className="icon icon-group-admin" title={ LocalizeText('group.youareadmin') } />;

        return <i className="icon icon-group-member" title={ LocalizeText('group.youaremember') } />;
    }, [ groupInformation, isOwner ]);

    const getButtonText = useCallback(() =>
    {
        if(groupInformation.type === GroupType.PRIVATE) return '';

        if(isOwner()) return 'group.youareowner';

        if(groupInformation.membershipType === GroupMembershipType.MEMBER) return 'group.leave';

        if(groupInformation.membershipType === GroupMembershipType.NOT_MEMBER && groupInformation.type === GroupType.REGULAR) return 'group.join';

        if(groupInformation.type === GroupType.EXCLUSIVE)
        {
            if(groupInformation.membershipType === GroupMembershipType.NOT_MEMBER) return 'group.requestmembership';

            if(groupInformation.membershipType === GroupMembershipType.REQUEST_PENDING) return 'group.membershippending';
        }
    }, [ groupInformation, isOwner ]);

    const handleButtonClick = useCallback(() =>
    {
        if(groupInformation.type === GroupType.PRIVATE && groupInformation.membershipType === GroupMembershipType.NOT_MEMBER) return;

        if(groupInformation.membershipType === GroupMembershipType.MEMBER) return tryLeaveGroup();

        return tryJoinGroup();
    }, [ groupInformation, tryLeaveGroup, tryJoinGroup ]);
    
    if(!group || !groupInformation) return null;

    return (
        <div className="group-information p-2">
            <div>
                <div className="group-badge text-center">
                    <BadgeImageView badgeCode={ group.badge } isGroup={ true } />
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
                </div>
            </div>
            <div className="ms-2 w-100">
                <div className="fw-bold d-flex align-items-center">
                    <i className={ 'icon icon-group-type-' + groupInformation.type } />
                    { groupInformation.canMembersDecorate && <i className="icon icon-group-decorate ms-1" /> }
                    <div className="ms-1">{ group.title }</div>
                </div>
                <div>{ LocalizeText('group.created', ['date', 'owner'], [groupInformation.createdAt, groupInformation.ownerName]) }</div>
                <div className="group-description small overflow-auto">{ groupInformation.description }</div>
                <div>
                    <a href="#" className="small text-black">
                        { LocalizeText('group.linktobase') }
                    </a>
                </div>
                <div>
                    <a href="#" className="small text-black">
                        { LocalizeText('group.buyfurni') }
                    </a>
                </div>
                <div>
                    <a href="#" className="small text-black">
                        { LocalizeText('group.showgroups') }
                    </a>
                </div>
                { groupInformation.type !== GroupType.PRIVATE && 
                    <button className="btn btn-primary w-100 mt-2" disabled={ groupInformation.membershipType === GroupMembershipType.REQUEST_PENDING || isOwner() } onClick={ handleButtonClick }>
                        { LocalizeText(getButtonText()) }
                    </button>
                }
            </div>
        </div>
    );
};
