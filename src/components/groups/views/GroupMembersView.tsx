import { AddLinkEventTracker, GetSessionDataManager, GroupAdminGiveComposer, GroupAdminTakeComposer, GroupConfirmMemberRemoveEvent, GroupConfirmRemoveMemberComposer, GroupMemberParser, GroupMembersComposer, GroupMembersEvent, GroupMembershipAcceptComposer, GroupMembershipDeclineComposer, GroupMembersParser, GroupRank, GroupRemoveMemberComposer, ILinkEventTracker, RemoveLinkEventTracker } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { GetUserProfile, LocalizeText, SendMessageComposer } from '../../../api';
import { Button, Column, Flex, Grid, LayoutAvatarImageView, LayoutBadgeImageView, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../common';
import { useMessageEvent, useNotification } from '../../../hooks';
import { classNames } from '../../../layout';

export const GroupMembersView: FC<{}> = props =>
{
    const [ groupId, setGroupId ] = useState<number>(-1);
    const [ levelId, setLevelId ] = useState<number>(-1);
    const [ membersData, setMembersData ] = useState<GroupMembersParser>(null);
    const [ pageId, setPageId ] = useState<number>(-1);
    const [ totalPages, setTotalPages ] = useState<number>(0);
    const [ searchQuery, setSearchQuery ] = useState<string>('');
    const [ removingMemberName, setRemovingMemberName ] = useState<string>(null);
    const { showConfirm = null } = useNotification();

    const getRankDescription = (member: GroupMemberParser) =>
    {
        if(member.rank === GroupRank.OWNER) return 'group.members.owner';

        if(membersData.admin)
        {
            if(member.rank === GroupRank.ADMIN) return 'group.members.removerights';

            if(member.rank === GroupRank.MEMBER) return 'group.members.giverights';
        }

        return '';
    };

    const refreshMembers = useCallback(() =>
    {
        if((groupId === -1) || (levelId === -1) || (pageId === -1)) return;

        SendMessageComposer(new GroupMembersComposer(groupId, pageId, searchQuery, levelId));
    }, [ groupId, levelId, pageId, searchQuery ]);

    const toggleAdmin = (member: GroupMemberParser) =>
    {
        if(!membersData.admin || (member.rank === GroupRank.OWNER)) return;

        if(member.rank !== GroupRank.ADMIN) SendMessageComposer(new GroupAdminGiveComposer(membersData.groupId, member.id));
        else SendMessageComposer(new GroupAdminTakeComposer(membersData.groupId, member.id));

        refreshMembers();
    };

    const acceptMembership = (member: GroupMemberParser) =>
    {
        if(!membersData.admin || (member.rank !== GroupRank.REQUESTED)) return;

        SendMessageComposer(new GroupMembershipAcceptComposer(membersData.groupId, member.id));

        refreshMembers();
    };

    const removeMemberOrDeclineMembership = (member: GroupMemberParser) =>
    {
        if(!membersData.admin) return;

        if(member.rank === GroupRank.REQUESTED)
        {
            SendMessageComposer(new GroupMembershipDeclineComposer(membersData.groupId, member.id));

            refreshMembers();

            return;
        }

        setRemovingMemberName(member.name);
        SendMessageComposer(new GroupConfirmRemoveMemberComposer(membersData.groupId, member.id));
    };

    useMessageEvent<GroupMembersEvent>(GroupMembersEvent, event =>
    {
        const parser = event.getParser();

        setMembersData(parser);
        setLevelId(parser.level);
        setTotalPages(Math.ceil(parser.totalMembersCount / parser.pageSize));
    });

    useMessageEvent<GroupConfirmMemberRemoveEvent>(GroupConfirmMemberRemoveEvent, event =>
    {
        const parser = event.getParser();

        showConfirm(LocalizeText(((parser.furnitureCount > 0) ? 'group.kickconfirm.desc' : 'group.kickconfirm_nofurni.desc'), [ 'user', 'amount' ], [ removingMemberName, parser.furnitureCount.toString() ]), () =>
        {
            SendMessageComposer(new GroupRemoveMemberComposer(membersData.groupId, parser.userId));

            refreshMembers();
        }, null);

        setRemovingMemberName(null);
    });

    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived: (url: string) =>
            {
                const parts = url.split('/');

                if(parts.length < 2) return;

                const groupId = (parseInt(parts[1]) || -1);
                const levelId = (parseInt(parts[2]) || 3);

                setGroupId(groupId);
                setLevelId(levelId);
                setPageId(0);
            },
            eventUrlPrefix: 'group-members/'
        };

        AddLinkEventTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, []);

    useEffect(() =>
    {
        setPageId(0);
    }, [ groupId, levelId, searchQuery ]);

    useEffect(() =>
    {
        if((groupId === -1) || (levelId === -1) || (pageId === -1)) return;

        SendMessageComposer(new GroupMembersComposer(groupId, pageId, searchQuery, levelId));
    }, [ groupId, levelId, pageId, searchQuery ]);

    useEffect(() =>
    {
        if(groupId === -1) return;

        setLevelId(-1);
        setMembersData(null);
        setTotalPages(0);
        setSearchQuery('');
        setRemovingMemberName(null);
    }, [ groupId ]);

    if((groupId === -1) || !membersData) return null;

    return (
        <NitroCardView className="w-[400px] max-h-[380px]        " theme="primary-slim">
            <NitroCardHeaderView headerText={ LocalizeText('group.members.title', [ 'groupName' ], [ membersData ? membersData.groupTitle : '' ]) } onCloseClick={ event => setGroupId(-1) } />
            <NitroCardContentView overflow="hidden">
                <div className="flex gap-2">
                    <Flex center className="group-badge">
                        <LayoutBadgeImageView badgeCode={ membersData.badge } className="mx-auto block" isGroup={ true } />
                    </Flex>
                    <Column fullWidth gap={ 1 }>
                        <input className="min-h-[calc(1.5em+.5rem+2px)] px-[.5rem] py-[.25rem] text-[.7875rem] rounded-[.2rem] w-full" placeholder={ LocalizeText('group.members.searchinfo') } type="text" value={ searchQuery } onChange={ event => setSearchQuery(event.target.value) } />
                        <select className="form-select form-select-sm w-full" value={ levelId } onChange={ event => setLevelId(parseInt(event.target.value)) }>
                            <option value="0">{ LocalizeText('group.members.search.all') }</option>
                            <option value="1">{ LocalizeText('group.members.search.admins') }</option>
                            <option value="2">{ LocalizeText('group.members.search.pending') }</option>
                        </select>
                    </Column>
                </div>
                <Grid className="nitro-group-members-list-grid" columnCount={ 2 } overflow="auto">
                    { membersData.result.map((member, index) =>
                    {
                        return (
                            <Flex key={ index } alignItems="center" className="p-2 bg-white rounded h-[50px] max-h-[50px]" gap={ 2 } overflow="hidden">
                                <div className="cursor-pointer relative overflow-hidden w-[40px] h-[50px]" onClick={ () => GetUserProfile(member.id) }>
                                    <LayoutAvatarImageView className="absolute -left-[25px] -top-[20px]" direction={ 2 } figure={ member.figure } headOnly={ true } />
                                </div>
                                <Column grow gap={ 1 }>
                                    <Text bold pointer small onClick={ event => GetUserProfile(member.id) }>{ member.name }</Text>
                                    { (member.rank !== GroupRank.REQUESTED) &&
                                        <Text italics small variant="muted">{ LocalizeText('group.members.since', [ 'date' ], [ member.joinedAt ]) }</Text> }
                                </Column>
                                <div className="flex flex-col gap-1">
                                    { (member.rank !== GroupRank.REQUESTED) &&
                                        <div className="flex items-center justify-center">
                                            <div className={ classNames(`nitro-icon icon-group-small-${ ((member.rank === GroupRank.OWNER) ? 'owner' : (member.rank === GroupRank.ADMIN) ? 'admin' : (membersData.admin && (member.rank === GroupRank.MEMBER)) ? 'not-admin' : '') }`, membersData.admin && 'cursor-pointer') } title={ LocalizeText(getRankDescription(member)) } onClick={ event => toggleAdmin(member) } />
                                        </div> }
                                    { membersData.admin && (member.rank === GroupRank.REQUESTED) &&
                                        <Flex alignItems="center">
                                            <div className="cursor-pointer nitro-friends-spritesheet icon-accept" title={ LocalizeText('group.members.accept') } onClick={ event => acceptMembership(member) } />
                                        </Flex> }
                                    { membersData.admin && (member.rank !== GroupRank.OWNER) && (member.id !== GetSessionDataManager().userId) &&
                                        <Flex alignItems="center">
                                            <div className="cursor-pointer nitro-friends-spritesheet icon-deny" title={ LocalizeText(member.rank === GroupRank.REQUESTED ? 'group.members.reject' : 'group.members.kick') } onClick={ event => removeMemberOrDeclineMembership(member) } />
                                        </Flex> }
                                </div>
                            </Flex>
                        );
                    }) }
                </Grid>
                <Flex alignItems="center" gap={ 1 } justifyContent="between">
                    <Button disabled={ (membersData.pageIndex === 0) } onClick={ event => setPageId(prevValue => (prevValue - 1)) }>
                        <FaChevronLeft className="fa-icon" />
                    </Button>
                    <Text small>
                        { LocalizeText('group.members.pageinfo', [ 'amount', 'page', 'totalPages' ], [ membersData.totalMembersCount.toString(), (membersData.pageIndex + 1).toString(), totalPages.toString() ]) }
                    </Text>
                    <Button disabled={ (membersData.pageIndex === (totalPages - 1)) } onClick={ event => setPageId(prevValue => (prevValue + 1)) }>
                        <FaChevronRight className="fa-icon" />
                    </Button>
                </Flex>
            </NitroCardContentView>
        </NitroCardView>
    );
};
