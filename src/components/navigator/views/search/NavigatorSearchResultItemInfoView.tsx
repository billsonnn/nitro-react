import { RoomDataParser } from '@nitrots/nitro-renderer';
import { FC, useRef, useState } from 'react';
import { Overlay, Popover } from 'react-bootstrap';
import { FaUser } from 'react-icons/fa';
import { LocalizeText } from '../../../../api';
import { Flex, LayoutBadgeImageView, LayoutRoomThumbnailView, NitroCardContentView, Text, UserProfileIconView } from '../../../../common';

interface NavigatorSearchResultItemInfoViewProps
{
    roomData: RoomDataParser;
}

export const NavigatorSearchResultItemInfoView: FC<NavigatorSearchResultItemInfoViewProps> = props =>
{
    const { roomData = null } = props;
    const [ isVisible, setIsVisible ] = useState(false);
    const elementRef = useRef<HTMLDivElement>();

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

    return (
        <>
            <div ref={ elementRef } className="icon icon-navigator-info cursor-pointer" onMouseLeave={ event => setIsVisible(false) } onMouseOver={ event => setIsVisible(true) } />
            <Overlay placement="right" show={ isVisible } target={ elementRef.current }>
                <Popover>
                    <NitroCardContentView className="room-info image-rendering-pixelated bg-transparent" overflow="hidden">
                        <Flex gap={ 2 } overflow="hidden">
                            <LayoutRoomThumbnailView className="flex flex-column items-center justify-content-end mb-1" customUrl={ roomData.officialRoomPicRef } roomId={ roomData.roomId }>
                                { roomData.habboGroupId > 0 && (
                                    <LayoutBadgeImageView badgeCode={ roomData.groupBadgeCode } className={ 'position-absolute top-0 start-0 m-1 ' } isGroup={ true }/>) }
                                { roomData.doorMode !== RoomDataParser.OPEN_STATE && (
                                    <i className={ 'position-absolute end-0 mb-1 me-1 icon icon-navigator-room-' + (roomData.doorMode === RoomDataParser.DOORBELL_STATE ? 'locked' : roomData.doorMode === RoomDataParser.PASSWORD_STATE ? 'password' : roomData.doorMode === RoomDataParser.INVISIBLE_STATE ? 'invisible' : '') }/> ) }
                            </LayoutRoomThumbnailView>
                            <div className="flex flex-column gap-1">
                                <Text bold truncate className="flex-grow-1" style={ { maxHeight: 13 } }>
                                    { roomData.roomName }
                                </Text>
                                <div className="flex gap-2">
                                    <Text italics variant="muted">
                                        { LocalizeText('navigator.roomownercaption') }
                                    </Text>
                                    <div className="flex items-center gap-1">
                                        <UserProfileIconView userId={ roomData.ownerId } />
                                        <Text italics>{ roomData.ownerName }</Text>
                                    </div>
                                </div>
                                <Text className="flex-grow-1">
                                    { roomData.description }
                                </Text>
                                <Flex className={ 'badge p-1 position-absolute m-1 bottom-0 end-0 m-2 ' + getUserCounterColor() } gap={ 1 }>
                                    <FaUser className="fa-icon" />
                                    { roomData.userCount }
                                </Flex>
                            </div>
                        </Flex>
                    </NitroCardContentView>
                </Popover>
            </Overlay>
        </>
    );
}
