import { CreateLinkEvent, GetGuestRoomResultEvent, GetRoomEngine, NavigatorSearchComposer, RateFlatMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { LocalizeText, SendMessageComposer } from '../../../../api';
import { Text, TransitionAnimation, TransitionAnimationTypes, classNames } from '../../../../common';
import { useMessageEvent, useNavigator, useRoom } from '../../../../hooks';

export const RoomToolsWidgetView: FC<{}> = props =>
{
    const [ isZoomedIn, setIsZoomedIn ] = useState<boolean>(false);
    const [ roomName, setRoomName ] = useState<string>(null);
    const [ roomOwner, setRoomOwner ] = useState<string>(null);
    const [ roomTags, setRoomTags ] = useState<string[]>(null);
    const [ isOpen, setIsOpen ] = useState<boolean>(false);
    const { navigatorData = null } = useNavigator();
    const { roomSession = null } = useRoom();

    const handleToolClick = (action: string, value?: string) =>
    {
        switch(action)
        {
            case 'settings':
                CreateLinkEvent('navigator/toggle-room-info');
                return;
            case 'zoom':
                setIsZoomedIn(prevValue =>
                {
                    let scale = GetRoomEngine().getRoomInstanceRenderingCanvasScale(roomSession.roomId, 1);

                    if(!prevValue) scale /= 2;
                    else scale *= 2;

                    GetRoomEngine().setRoomInstanceRenderingCanvasScale(roomSession.roomId, 1, scale);

                    return !prevValue;
                });
                return;
            case 'chat_history':
                CreateLinkEvent('chat-history/toggle');
                return;
            case 'like_room':
                SendMessageComposer(new RateFlatMessageComposer(1));
                return;
            case 'toggle_room_link':
                CreateLinkEvent('navigator/toggle-room-link');
                return;
            case 'navigator_search_tag':
                CreateLinkEvent(`navigator/search/${ value }`);
                SendMessageComposer(new NavigatorSearchComposer('hotel_view', `tag:${ value }`));
                return;
        }
    }

    useMessageEvent<GetGuestRoomResultEvent>(GetGuestRoomResultEvent, event =>
    {
        const parser = event.getParser();

        if(!parser.roomEnter || (parser.data.roomId !== roomSession.roomId)) return;

        if(roomName !== parser.data.roomName) setRoomName(parser.data.roomName);
        if(roomOwner !== parser.data.ownerName) setRoomOwner(parser.data.ownerName);
        if(roomTags !== parser.data.tags) setRoomTags(parser.data.tags);
    });

    useEffect(() =>
    {
        setIsOpen(true);

        const timeout = setTimeout(() => setIsOpen(false), 5000);

        return () => clearTimeout(timeout);
    }, [ roomName, roomOwner, roomTags ]);

    return (
        <div className="flex gap-2 nitro-room-tools-container">
            <div className="flex flex-column justify-center items-center nitro-room-tools p-2">
                <div className="icon icon-cog cursor-pointer" title={ LocalizeText('room.settings.button.text') } onClick={ () => handleToolClick('settings') } />
                <div className={ classNames('cursor-pointer', 'icon', (!isZoomedIn && 'icon-zoom-less'), (isZoomedIn && 'icon-zoom-more')) } title={ LocalizeText('room.zoom.button.text') } onClick={ () => handleToolClick('zoom') } />
                <div className="icon icon-chat-history cursor-pointer" title={ LocalizeText('room.chathistory.button.text') } onClick={ () => handleToolClick('chat_history') } />
                { navigatorData.canRate &&
                    <div className="icon icon-like-room cursor-pointer" title={ LocalizeText('room.like.button.text') } onClick={ () => handleToolClick('like_room') } /> }
            </div>
            <div className="flex flex-column justify-center">
                <TransitionAnimation inProp={ isOpen } timeout={ 300 } type={ TransitionAnimationTypes.SLIDE_LEFT }>
                    <div className="flex flex-column justify-center items-center">
                        <div className="flex flex-column nitro-room-tools-info rounded py-2 px-3">
                            <div className="flex flex-column gap-1">
                                <Text wrap fontSize={ 4 } variant="white">{ roomName }</Text>
                                <Text fontSize={ 5 } variant="muted">{ roomOwner }</Text>
                            </div>
                            { roomTags && roomTags.length > 0 &&
                                <div className="flex gap-2">
                                    { roomTags.map((tag, index) => <Text key={ index } pointer small className="rounded bg-primary p-1" variant="white" onClick={ () => handleToolClick('navigator_search_tag', tag) }>#{ tag }</Text>) }
                                </div> }
                        </div>
                    </div>
                </TransitionAnimation>
            </div>
        </div>
    );
}
