import { RoomDataParser } from '@nitrots/nitro-renderer';
import { FC, useRef, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { LocalizeText } from '../../../../api';
import { Flex, LayoutBadgeImageView, LayoutRoomThumbnailView, NitroCardContentView, Text, UserProfileIconView } from '../../../../common';

export const NavigatorSearchResultItemInfoView: FC<{
    roomData: RoomDataParser;
}> = props =>
    {
        const { roomData = null } = props;
        const [isVisible, setIsVisible] = useState(false);
        const elementRef = useRef<HTMLDivElement>();

        const getUserCounterColor = () =>
        {
            const num: number = (100 * (roomData.userCount / roomData.maxUserCount));

            let bg = 'bg-primary';

            if (num >= 92)
            {
                bg = 'bg-danger';
            }
            else if (num >= 50)
            {
                bg = 'bg-warning';
            }
            else if (num > 0)
            {
                bg = 'bg-success';
            }

            return bg;
        }

        return (
            <>
                <div ref={elementRef} className="cursor-pointer nitro-icon icon-navigator-info" onMouseLeave={event => setIsVisible(false)} onMouseOver={event => setIsVisible(true)} />
                <>
                    <NitroCardContentView className="bg-transparent room-info image-rendering-pixelated" overflow="hidden">
                        <Flex gap={2} overflow="hidden">
                            <LayoutRoomThumbnailView className="flex flex-col items-center mb-1 justify-end" customUrl={roomData.officialRoomPicRef} roomId={roomData.roomId}>
                                {roomData.habboGroupId > 0 && (
                                    <LayoutBadgeImageView badgeCode={roomData.groupBadgeCode} className={'absolute top-0 start-0 m-1 '} isGroup={true} />)}
                                {roomData.doorMode !== RoomDataParser.OPEN_STATE && (
                                    <i className={'absolute end-0 mb-1 me-1 icon icon-navigator-room-' + (roomData.doorMode === RoomDataParser.DOORBELL_STATE ? 'locked' : roomData.doorMode === RoomDataParser.PASSWORD_STATE ? 'password' : roomData.doorMode === RoomDataParser.INVISIBLE_STATE ? 'invisible' : '')} />)}
                            </LayoutRoomThumbnailView>
                            <div className="flex flex-col gap-1">
                                <Text bold truncate className="!flex-grow" style={{ maxHeight: 13 }}>
                                    {roomData.roomName}
                                </Text>
                                <div className="flex gap-2">
                                    <Text italics variant="muted">
                                        {LocalizeText('navigator.roomownercaption')}
                                    </Text>
                                    <div className="flex items-center gap-1">
                                        <UserProfileIconView userId={roomData.ownerId} />
                                        <Text italics>{roomData.ownerName}</Text>
                                    </div>
                                </div>
                                <Text className="!flex-grow">
                                    {roomData.description}
                                </Text>
                                <Flex className={'inline-block px-[.65em] py-[.35em] text-[.75em] font-bold leading-none text-[#fff] text-center whitespace-nowrap align-baseline rounded-[.25rem] p-1 absolute m-1 bottom-0 end-0 m-2 ' + getUserCounterColor()} gap={1}>
                                    <FaUser className="fa-icon" />
                                    {roomData.userCount}
                                </Flex>
                            </div>
                        </Flex>
                    </NitroCardContentView>
                </>
            </>
        );
    }
