import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RoomDataParser } from '@nitrots/nitro-renderer';
import { FC, MouseEvent, useEffect, useState } from 'react';
import { Overlay, Popover } from 'react-bootstrap';
import { LocalizeText } from '../../../../api';
import { Base, Column, Flex, LayoutBadgeImageView, LayoutRoomThumbnailView, NitroCardContentView, Text, UserProfileIconView } from '../../../../common';

interface NavigatorSearchResultItemInfoViewProps
{
    roomData: RoomDataParser;
}

export const NavigatorSearchResultItemInfoView: FC<NavigatorSearchResultItemInfoViewProps> = props =>
{
    const { roomData = null } = props;
    const [ target, setTarget ] = useState<(EventTarget & HTMLElement)>(null);
    const [ isVisible, setIsVisible ] = useState(false);

    const getUserCounterColor = () =>
    {
        const num: number = (100 * (roomData.userCount / roomData.maxUserCount));

        let bg = 'bg-primary';

        if(num >= 92)
        {
            bg = 'bg-danger';
        }
        else if(num >= 50)
        {
            bg = 'bg-warning';
        }
        else if(num > 0)
        {
            bg = 'bg-success';
        }

        return bg;
    }

    const toggle = (event: MouseEvent<HTMLElement>) =>
    {
        event.stopPropagation();
        
        let visible = false;

        setIsVisible(prevValue =>
        {
            visible = !prevValue;

            return visible;
        });

        if(visible) setTarget((event.target as (EventTarget & HTMLElement)));
    }

    useEffect(() =>
    {
        if(isVisible) return;

        setTarget(null);
    }, [ isVisible ]);

    return (
        <>
            <Base pointer className="icon icon-navigator-info" onClick={ toggle }/>
            <Overlay show={ isVisible } target={ target } placement="right">
                <Popover>
                    <NitroCardContentView overflow="hidden" className="room-info bg-transparent">
                        <Flex gap={ 2 } overflow="hidden">
                            <LayoutRoomThumbnailView roomId={ roomData.roomId } customUrl={ roomData.officialRoomPicRef } className="d-flex flex-column align-items-center justify-content-end mb-1">
                                { roomData.habboGroupId > 0 && (
                                    <LayoutBadgeImageView badgeCode={ roomData.groupBadgeCode } isGroup={ true } className={ 'position-absolute top-0 start-0 m-1 ' }/>) }
                                { roomData.doorMode !== RoomDataParser.OPEN_STATE && (
                                    <i className={ 'position-absolute end-0 mb-1 me-1 icon icon-navigator-room-' + (roomData.doorMode === RoomDataParser.DOORBELL_STATE ? 'locked' : roomData.doorMode === RoomDataParser.PASSWORD_STATE ? 'password' : roomData.doorMode === RoomDataParser.INVISIBLE_STATE ? 'invisible' : '') }/> ) }
                            </LayoutRoomThumbnailView>
                            <Column gap={ 1 }>
                                <Text bold truncate className="flex-grow-1" style={ { maxHeight: 13 } }>
                                    { roomData.roomName }
                                </Text>
                                <Flex gap={ 1 }>
                                    <Text italics variant="muted">
                                        { LocalizeText('navigator.roomownercaption') }
                                    </Text>
                                    <UserProfileIconView
                                        userId={ roomData.ownerId }
                                    />
                                    <Text italics>{ roomData.ownerName }</Text>
                                </Flex>
                                <Text className="flex-grow-1">
                                    { roomData.description }
                                </Text>
                                <Flex className={ 'badge p-1 position-absolute m-1 bottom-0 end-0 m-2 ' + getUserCounterColor() } gap={ 1 }>
                                    <FontAwesomeIcon icon="user" />
                                    { roomData.userCount }
                                </Flex>
                            </Column>
                        </Flex>
                    </NitroCardContentView>
                </Popover>
            </Overlay>
        </>
    );
}
