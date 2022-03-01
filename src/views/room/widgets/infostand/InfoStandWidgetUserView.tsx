import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RelationshipStatusInfoEvent, RelationshipStatusInfoMessageParser, RoomSessionUserBadgesEvent, UserRelationshipsComposer } from '@nitrots/nitro-renderer';
import { FC, FocusEvent, KeyboardEvent, useCallback, useEffect, useState } from 'react';
import { GetConfiguration, GetGroupInformation, LocalizeText, RoomWidgetChangeMottoMessage, RoomWidgetUpdateInfostandUserEvent } from '../../../../api';
import { Column, Text } from '../../../../common';
import { Base } from '../../../../common/Base';
import { Flex } from '../../../../common/Flex';
import { BatchUpdates, CreateMessageHook, SendMessageHook } from '../../../../hooks';
import { CreateEventDispatcherHook } from '../../../../hooks/events';
import { UserProfileIconView } from '../../../../layout';
import { AvatarImageView } from '../../../shared/avatar-image/AvatarImageView';
import { BadgeImageView } from '../../../shared/badge-image/BadgeImageView';
import { useRoomContext } from '../../context/RoomContext';
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

    CreateEventDispatcherHook(RoomSessionUserBadgesEvent.RSUBE_BADGES, eventDispatcher, onRoomSessionUserBadgesEvent);

    const onUserRelationshipsEvent = useCallback((event: RelationshipStatusInfoEvent) =>
    {
        const parser = event.getParser();

        if(!userData || (userData.webID !== parser.userId)) return;
        
        setUserRelationships(parser);
    }, [ userData ]);

    CreateMessageHook(RelationshipStatusInfoEvent, onUserRelationshipsEvent);

    useEffect(() =>
    {
        BatchUpdates(() =>
        {
            setBadges(userData.badges);
            setIsEditingMotto(false);
            setMotto(userData.motto);
        });
        
        SendMessageHook(new UserRelationshipsComposer(userData.webID));

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
                            <AvatarImageView figure={ userData.figure } direction={ 4 } />
                        </Column>
                        <Column grow gap={ 0 }>
                            <Flex gap={ 1 }>
                                <Base className="badge-image">
                                    { badges[0] && <BadgeImageView badgeCode={ badges[0] } showInfo={ true } /> }
                                </Base>
                                <Base pointer={ ( userData.groupId > 0) } className="badge-image" onClick={ event => GetGroupInformation(userData.groupId) }>
                                    { userData.groupId > 0 &&
                                        <BadgeImageView badgeCode={ userData.groupBadgeId } isGroup={ true } showInfo={ true } customTitle={ userData.groupName } /> }
                                </Base>
                            </Flex>
                            <Flex gap={ 1 }>
                                <Base className="badge-image">
                                    { badges[1] && <BadgeImageView badgeCode={ badges[1] } showInfo={ true } /> }
                                </Base>
                                <Base className="badge-image">
                                    { badges[2] && <BadgeImageView badgeCode={ badges[2] } showInfo={ true } /> }
                                </Base>
                            </Flex>
                            <Flex gap={ 1 }>
                                <Base className="badge-image">
                                    { badges[3] && <BadgeImageView badgeCode={ badges[3] } showInfo={ true } /> }
                                </Base>
                                <Base className="badge-image">
                                    { badges[4] && <BadgeImageView badgeCode={ badges[4] } showInfo={ true } /> }
                                </Base>
                            </Flex>
                        </Column>
                    </Flex>
                    <hr className="m-0" />
                </Column>
                <Column gap={ 1 }>
                    <Flex alignItems="center" className="bg-light-dark rounded py-1 px-2">
                        { (userData.type !== RoomWidgetUpdateInfostandUserEvent.OWN_USER) &&
                            <Text fullWidth wrap textBreak variant="white" small className="motto-content">{ motto }</Text> }
                        { userData.type === RoomWidgetUpdateInfostandUserEvent.OWN_USER &&
                            <Flex grow alignItems="center" gap={ 2 }>
                                <FontAwesomeIcon icon="pencil-alt" className="small" />
                                { !isEditingMotto &&
                                    <Text fullWidth pointer wrap textBreak small variant="white" className="motto-content" onClick={ event => setIsEditingMotto(true) }>{ motto }</Text> }
                                { isEditingMotto &&
                                    <input type="text" className="motto-input" maxLength={ 38 } value={ motto } onChange={ event => setMotto(event.target.value) } onBlur={ onMottoBlur } onKeyDown={ onMottoKeyDown } autoFocus={ true } /> }
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
