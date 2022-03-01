import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { GetConfiguration, GetNitroInstance, LocalizeText } from '../../../../api';
import { Column } from '../../../../common/Column';
import { Flex } from '../../../../common/Flex';
import { Text } from '../../../../common/Text';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../layout';
import { RoomThumbnailView } from '../../../../layout/room-thumbnail/RoomThumbnailView';
import { useNavigatorContext } from '../../NavigatorContext';

export class NavigatorRoomLinkViewProps
{
    onCloseClick: () => void;
}

export const NavigatorRoomLinkView: FC<NavigatorRoomLinkViewProps> = props =>
{
    const { onCloseClick = null } = props;
    const [ roomThumbnail, setRoomThumbnail ] = useState(null);
    const [ roomLink, setRoomLink ] = useState(null);
    const { navigatorState = null } = useNavigatorContext();
    const { roomInfoData = null } = navigatorState;
    const elementRef = useRef<HTMLInputElement>();
    
    useEffect(() =>
    {
        if(!roomInfoData || !roomInfoData.enteredGuestRoom) return;

        if(roomInfoData.enteredGuestRoom.officialRoomPicRef)
        {
            setRoomThumbnail(GetConfiguration<string>('image.library.url') + roomInfoData.enteredGuestRoom.officialRoomPicRef);
        }

        const roomLinkRaw = GetNitroInstance().core.configuration.interpolate(LocalizeText('navigator.embed.src', ['roomId'], [roomInfoData.enteredGuestRoom.roomId.toString()]));

        setRoomLink(roomLinkRaw);
    }, [ roomInfoData ]);

    const processAction = useCallback((action: string) =>
    {
        if(!roomInfoData || !roomInfoData.enteredGuestRoom) return;

        switch(action)
        {
            case 'copy_room_link':
                elementRef.current.select();
                document.execCommand('copy');
                return;
            case 'close':
                onCloseClick();
                return;
        }
        
    }, [onCloseClick, roomInfoData]);

    if(!roomInfoData) return null;
    
    return (
        <NitroCardView className="nitro-room-link" simple={ true }>
            <NitroCardHeaderView headerText={ LocalizeText('navigator.embed.title') } onCloseClick={ onCloseClick } />
            <NitroCardContentView className="text-black d-flex align-items-center">
                <Flex gap={ 2 }>
                    <RoomThumbnailView customUrl={ roomInfoData.enteredGuestRoom.officialRoomPicRef } />
                    <Column>
                        <Text bold fontSize={ 5 }>{ LocalizeText('navigator.embed.headline') }</Text>
                        <Text>{ LocalizeText('navigator.embed.info') }</Text>
                        { roomLink && <input ref={ elementRef } type="text" readOnly className="form-control form-control-sm" value={ roomLink } /> }
                    </Column>
                </Flex>
            </NitroCardContentView>
        </NitroCardView>
    );
};
