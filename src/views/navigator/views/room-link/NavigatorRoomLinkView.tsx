import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { GetConfiguration } from '../../../../api';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../layout';
import { LocalizeText } from '../../../../utils/LocalizeText';
import { useNavigatorContext } from '../../context/NavigatorContext';
import { NavigatorRoomLinkViewProps } from './NavigatorRoomLinkView.types';

export const NavigatorRoomLinkView: FC<NavigatorRoomLinkViewProps> = props =>
{
    const { onCloseClick = null } = props;
    const { navigatorState = null } = useNavigatorContext();
    const { roomInfoData = null } = navigatorState;

    const [ roomThumbnail, setRoomThumbnail ] = useState(null);
    const [ roomLink, setRoomLink ] = useState(null);
    
    const elementRef = useRef<HTMLInputElement>();
    
    useEffect(() =>
    {
        if(!roomInfoData || !roomInfoData.enteredGuestRoom) return;

        if(roomInfoData.enteredGuestRoom.officialRoomPicRef)
        {
            setRoomThumbnail(GetConfiguration<string>('image.library.url') + roomInfoData.enteredGuestRoom.officialRoomPicRef);
        }

        const urlPrefix = GetConfiguration<string>('url.prefix');
        const roomLinkRaw = LocalizeText('navigator.embed.src', ['roomId'], [roomInfoData.enteredGuestRoom.roomId.toString()]).replace('${url.prefix}', urlPrefix);

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
            <NitroCardHeaderView headerText={ LocalizeText('navigator.embed.title') } onCloseClick={ () => processAction('close') } />
            <NitroCardContentView className="text-black d-flex align-items-center">
                <div className="me-3">
                    <div className="room-thumbnail border">
                        { roomThumbnail && <img alt="" src={ roomThumbnail } /> }
                    </div>
                </div>
                <div>
                    <div className="h5 fw-bold m-0">{ LocalizeText('navigator.embed.headline') }</div>
                    <div>{ LocalizeText('navigator.embed.info') }</div>
                    { roomLink && <input ref={ elementRef } type="text" readOnly className="form-control form-control-sm" value={ roomLink } /> }
                </div>
            </NitroCardContentView>
        </NitroCardView>
    );
};
