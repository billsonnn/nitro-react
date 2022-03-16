import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RelationshipStatusInfoEvent, RelationshipStatusInfoMessageParser, RoomSessionUserBadgesEvent, UserRelationshipsComposer } from '@nitrots/nitro-renderer';
import { FC, FocusEvent, KeyboardEvent, useCallback, useEffect, useState } from 'react';
import { GetConfiguration, GetGroupInformation, LocalizeText, RoomWidgetChangeMottoMessage, RoomWidgetUpdateInfostandUserEvent, SendMessageComposer } from '../../../../api';
import { Base, Column, Flex, LayoutAvatarImageView, LayoutBadgeImageView, Text, UserProfileIconView } from '../../../../common';
import { BatchUpdates, UseEventDispatcherHook, UseMessageEventHook } from '../../../../hooks';
import { useRoomContext } from '../../RoomContext';
import { InfoStandWidgetUserRelationshipsView } from './InfoStandWidgetUserRelationshipsView';

interface InfoStandWidgetUserViewProps
{
    userData: RoomWidgetUpdateInfostandUserEvent;
    close: () => void;
}

export const InfoStandWidgetUserView: FC<InfoStandWidgetUserViewProps> = props =>
{
    const { userData = null, close = null } = props;
    const { eventDispatcher = null, widgetHandler = null } = useRoomContext();
    const [ badges, setBadges ] = useState<string[]>([]);
    const [ motto, setMotto ] = useState(null);
    const [ isEditingMotto, setIsEditingMotto ] = useState(false);
    const [ userRelationships, setUserRelationships ] = useState<RelationshipStatusInfoMessageParser>(null);

    const maxBadgeCount = GetConfiguration<number>('user.badges.max.slots', 5);

    const saveMotto = (motto: string) =>
    {
        if(motto.length > 38) return;

        widgetHandler.processWidgetMessage(new RoomWidgetChangeMottoMessage(motto));

        setIsEditingMotto(false);
    }

    const onMottoBlur = (event: FocusEvent<HTMLInputElement>) => saveMotto(event.target.value);

    const onMottoKeyDown = (event: KeyboardEvent<HTMLInputElement>) =>
    {
        event.stopPropagation();
        
        switch(event.key)
        {
            case 'Enter':
                saveMotto((event.target as HTMLInputElement).value);
                return;
        }
    }

    const onRoomSessionUserBadgesEvent = useCallback((event: RoomSessionUserBadgesEvent) =>
    {
        if(!userData || (userData.webID !== event.userId)) return;

        setBadges(event.badges);
    }, [ userData ]);

    UseEventDispatcherHook(RoomSessionUserBadgesEvent.RSUBE_BADGES, eventDispatcher, onRoomSessionUserBadgesEvent);

    const onUserRelationshipsEvent = useCallback((event: RelationshipStatusInfoEvent) =>
    {
        const parser = event.getParser();

        if(!userData || (userData.webID !== parser.userId)) return;
        
        setUserRelationships(parser);
    }, [ userData ]);

    UseMessageEventHook(RelationshipStatusInfoEvent, onUserRelationshipsEvent);

    useEffect(() =>
    {
        BatchUpdates(() =>
        {
            setBadges(userData.badges);
            setIsEditingMotto(false);
            setMotto(userData.motto);
        });
        
        SendMessageComposer(new UserRelationshipsComposer(userData.webID));

        return () => 
        {
            setBadges([]);
            setUserRelationships(null);
        }
    }, [ userData ]);

    if(!userData) return null;

    return (
        <Column className="nitro-infostand rounded">
            <Column overflow="visible" className="container-fluid content-area" gap={ 1 }>
                <Column gap={ 1 }>
                    <Flex alignItems="center" justifyContent="between">
                        <Flex alignItems="center" gap={ 1 }>
                            <UserProfileIconView userId={ userData.webID } />
                            <Text variant="white" small wrap>{ userData.name }</Text>
                        </Flex>
                        <FontAwesomeIcon icon="times" className="cursor-pointer" onClick={ close } />
                    </Flex>
                    <hr className="m-0" />
                </Column>
                <Column gap={ 1 }>
                    <Flex gap={ 1 }>
                        <Column fullWidth className="body-image">
                            <LayoutAvatarImageView figure={ userData.figure } direction={ 4 } />
                        </Column>
                        <Column grow gap={ 0 }>
                            <Flex gap={ 1 }>
                                <Base className="badge-image">
                                    { badges[0] && <LayoutBadgeImageView badgeCode={ badges[0] } showInfo={ true } /> }
                                </Base>
                                <Base pointer={ ( userData.groupId > 0) } className="badge-image" onClick={ event => GetGroupInformation(userData.groupId) }>
                                    { userData.groupId > 0 &&
                                        <LayoutBadgeImageView badgeCode={ userData.groupBadgeId } isGroup={ true } showInfo={ true } customTitle={ userData.groupName } /> }
                                </Base>
                            </Flex>
                            <Flex gap={ 1 }>
                                <Base className="badge-image">
                                    { badges[1] && <LayoutBadgeImageView badgeCode={ badges[1] } showInfo={ true } /> }
                                </Base>
                                <Base className="badge-image">
                                    { badges[2] && <LayoutBadgeImageView badgeCode={ badges[2] } showInfo={ true } /> }
                                </Base>
                            </Flex>
                            <Flex gap={ 1 }>
                                <Base className="badge-image">
                                    { badges[3] && <LayoutBadgeImageView badgeCode={ badges[3] } showInfo={ true } /> }
                                </Base>
                                <Base className="badge-image">
                                    { badges[4] && <LayoutBadgeImageView badgeCode={ badges[4] } showInfo={ true } /> }
                                </Base>
                            </Flex>
                        </Column>
                    </Flex>
                    <hr className="m-0" />
                </Column>
                <Column gap={ 1 }>
                    <Flex alignItems="center" className="bg-light-dark rounded py-1 px-2">
                        { (userData.type !== RoomWidgetUpdateInfostandUserEvent.OWN_USER) &&
                            <Flex grow alignItems="center" className="motto-content">
                                <Text fullWidth pointer wrap textBreak small variant="white">{ motto }</Text>
                            </Flex> }
                        { userData.type === RoomWidgetUpdateInfostandUserEvent.OWN_USER &&
                            <Flex grow alignItems="center" gap={ 2 }>
                                <FontAwesomeIcon icon="pencil-alt" className="small" />
                                <Flex grow alignItems="center" className="motto-content">
                                    { !isEditingMotto &&
                                        <Text fullWidth pointer wrap textBreak small variant="white" onClick={ event => setIsEditingMotto(true) }>{ motto }</Text> }
                                    { isEditingMotto &&
                                        <input type="text" className="motto-input" maxLength={ 38 } value={ motto } onChange={ event => setMotto(event.target.value) } onBlur={ onMottoBlur } onKeyDown={ onMottoKeyDown } autoFocus={ true } /> }
                                </Flex>
                            </Flex> }
                    </Flex>
                    <hr className="m-0" />
                </Column>
                <Column gap={ 1 }>
                    <Text variant="white" small wrap>
                        { LocalizeText('infostand.text.achievement_score') + ' ' + userData.achievementScore }
                    </Text>
                    { (userData.carryItem > 0) &&
                        <>
                            <hr className="m-0" />
                            <Text variant="white" small wrap>
                                { LocalizeText('infostand.text.handitem', [ 'item' ], [ LocalizeText('handitem' + userData.carryItem) ]) }
                            </Text>
                        </> }
                </Column>
                <Column gap={ 1 }>
                    <InfoStandWidgetUserRelationshipsView relationships={ userRelationships } />
                </Column>
            </Column>
        </Column>
    );
}
