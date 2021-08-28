import { GroupInformationComposer, GroupInformationEvent, GroupInformationParser } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { LocalizeText } from '../../../api';
import { CreateMessageHook, SendMessageHook } from '../../../hooks';
import { BadgeImageView } from '../../shared/badge-image/BadgeImageView';
import { GroupMembershipType } from '../common/GroupMembershipType';
import { GroupType } from '../common/GroupType';
import { GroupInformationViewProps } from './GroupInformationView.types';

export const GroupInformationView: FC<GroupInformationViewProps> = props =>
{
    const { group = null } = props;

    const [ groupInformation, setGroupInformation ] = useState<GroupInformationParser>(null);

    useEffect(() =>
    {
        setGroupInformation(null);
        if(group) SendMessageHook(new GroupInformationComposer(group.id, true));
    }, [ group ]);

    const onGroupInformationEvent = useCallback((event: GroupInformationEvent) =>
    {
        const parser = event.getParser();
        setGroupInformation(parser);
    }, []);

    CreateMessageHook(GroupInformationEvent, onGroupInformationEvent);
    
    if(!groupInformation) return null;

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
                        { groupInformation.membershipType === GroupMembershipType.MEMBER && !groupInformation.isAdmin && <i className="icon icon-group-member" title={ LocalizeText('group.youaremember') } /> }
                        { groupInformation.isAdmin && !groupInformation.isOwner && <i className="icon icon-group-admin" title={ LocalizeText('group.youareadmin') } /> }
                        { groupInformation.isOwner && <i className="icon icon-group-owner" title={ LocalizeText('group.youareowner') } /> }
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
                    <button className="btn btn-primary w-100 mt-2" disabled={ groupInformation.membershipType === GroupMembershipType.REQUEST_PENDING }>
                        { groupInformation.membershipType === GroupMembershipType.MEMBER && LocalizeText('group.leave') }
                        { groupInformation.membershipType === GroupMembershipType.NOT_MEMBER && groupInformation.type === GroupType.REGULAR && LocalizeText('group.join') }
                        { groupInformation.type === GroupType.EXCLUSIVE && <>
                            { groupInformation.membershipType === GroupMembershipType.NOT_MEMBER && LocalizeText('group.requestmembership') }
                            { groupInformation.membershipType === GroupMembershipType.REQUEST_PENDING && LocalizeText('group.membershippending') }
                        </> }
                    </button>
                }
            </div>
        </div>
    );
};
