import { GetGuestRoomResultEvent, NavigatorSearchComposer, RateFlatMessageComposer, RoomDataParser } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { CreateLinkEvent, GetRoomEngine, LocalizeText, SendMessageComposer, SetLocalStorage, TryVisitRoom } from '../../../../api';
import { Base, Column, Flex, Text, TransitionAnimation, TransitionAnimationTypes, classNames } from '../../../../common';
import { useMessageEvent, useNavigator, useRoom } from '../../../../hooks';

export const RoomToolsWidgetView: FC<{}> = props =>
{
    const [ isZoomedIn, setIsZoomedIn ] = useState<boolean>(false);
    const [ roomName, setRoomName ] = useState<string>(null);
    const [ roomOwner, setRoomOwner ] = useState<string>(null);
    const [ roomTags, setRoomTags ] = useState<string[]>(null);
    const [ isOpen, setIsOpen ] = useState<boolean>(false);
    const [ isOpenHistory, setIsOpenHistory ] = useState<boolean>(false);
    const [ show, setShow ] = useState(true);
    const [ roomHistory, setRoomHistory ] = useState<{ roomId: number, roomName: string }[]>([]);
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
            case 'room_history':
                if (roomHistory.length > 0) setIsOpenHistory(prevValue => !prevValue);
                return;
            case 'room_history_back':
                TryVisitRoom(roomHistory[roomHistory.findIndex(room => room.roomId === navigatorData.currentRoomId) - 1].roomId);
                return;
            case 'room_history_next':
                TryVisitRoom(roomHistory[roomHistory.findIndex(room => room.roomId === navigatorData.currentRoomId) + 1].roomId);
                return;
        }
    }

    const onChangeRoomHistory = (roomId: number, roomName: string) =>
    {
        let newStorage = JSON.parse(window.localStorage.getItem('nitro.room.history'));

        if (newStorage && newStorage.filter( (room: RoomDataParser) => room.roomId === roomId ).length > 0) return;

        if (newStorage && newStorage.length >= 10) newStorage.shift();

        const newData = !newStorage ? [ { roomId: roomId, roomName: roomName } ] : [ ...newStorage, { roomId: roomId, roomName: roomName } ];

        setRoomHistory(newData);
        return SetLocalStorage('nitro.room.history', newData );
    }

    useMessageEvent<GetGuestRoomResultEvent>(GetGuestRoomResultEvent, event =>
    {
        const parser = event.getParser();

        if(!parser.roomEnter || (parser.data.roomId !== roomSession.roomId)) return;

        if(roomName !== parser.data.roomName) setRoomName(parser.data.roomName);
        if(roomOwner !== parser.data.ownerName) setRoomOwner(parser.data.ownerName);
        if(roomTags !== parser.data.tags) setRoomTags(parser.data.tags);

        onChangeRoomHistory(parser.data.roomId, parser.data.roomName);
    });

    useEffect(() => 
    {
        const handleTabClose = () => 
        {
            if (JSON.parse(window.localStorage.getItem('nitro.room.history'))) window.localStorage.removeItem('nitro.room.history');
        };
    
        window.addEventListener('beforeunload', handleTabClose);
    
        return () => 
        {
            window.removeEventListener('beforeunload', handleTabClose);
        };
    }, []);

    useEffect(() =>
    {
        setIsOpen(true);

        const timeout = setTimeout(() => setIsOpen(false), 5000);

        return () => clearTimeout(timeout);
    }, [ roomName, roomOwner, roomTags, show ]);

    useEffect(() =>
    {
        setRoomHistory(JSON.parse(window.localStorage.getItem('nitro.room.history')) ?? []);
    }, [ ]);

    return (
        <Flex className="nitro-room-tools-container" gap={ 2 }>
            <div className="btn-toggle toggle-roomtool d-flex align-items-center" onClick={ () => setShow(!show) }>
                <div className={ 'toggle-icon ' + (!show ? 'right' : 'left') } />
            </div>
            { show && (
                <>
                    <Column gap={ 0 } center className="nitro-room-tools p-3 px-3">
                        <Flex>
                            <Column center className="margin-icons p-2">
                                <Base pointer title={ LocalizeText('room.settings.button.text') } className="icon icon-cog" onClick={ () => handleToolClick('settings') } />
                                <Base pointer title={ LocalizeText('room.zoom.button.text') } onClick={ () => handleToolClick('zoom') } className={ classNames('icon', (!isZoomedIn && 'icon-zoom-less'), (isZoomedIn && 'icon-zoom-more')) } />
                                <Base pointer title={ LocalizeText('room.chathistory.button.text') } onClick={ () => handleToolClick('chat_history') } className="icon icon-chat-history" />
                                { navigatorData.canRate &&
                                    <Base pointer title={ LocalizeText('room.like.button.text') } onClick={ () => handleToolClick('like_room') } className="icon icon-like-room" /> }
                                <Base pointer onClick={ () => handleToolClick('toggle_room_link') } className="icon icon-room-link" />
                            </Column>
                            <Column>
                                <Flex className="w-100 room-tool-item">
                                    <Text variant="muted" underline small onClick={ () => handleToolClick('settings') }>{ LocalizeText('room.settings.button.text') }</Text>
                                </Flex>
                                <Flex className="w-100 room-tool-item">
                                    <Text variant="muted" underline small onClick={ () => handleToolClick('zoom') }>{ LocalizeText('room.zoom.button.text') }</Text>
                                </Flex>
                                <Flex className="w-100 room-tool-item">
                                    <Text variant="muted" underline small onClick={ () => handleToolClick('chat_history') }>{ LocalizeText('room.chathistory.button.text') }</Text></Flex>
                                { navigatorData.canRate &&
                                    <Flex className="w-100 room-tool-item">
                                        <Text variant="muted" underline small onClick={ () => handleToolClick('like_room') }>{ LocalizeText('room.like.button.text') }</Text>
                                    </Flex> }
                                <Flex className="w-100 room-tool-item">
                                    <Text variant="muted" underline small onClick={ () => handleToolClick('toggle_room_link') }>{ LocalizeText('navigator.embed.caption') }</Text>
                                </Flex>
                            </Column>
                        </Flex>
                        <Flex justifyContent="center">
                            <Base pointer={ roomHistory.length > 1 && roomHistory[0]?.roomId !== navigatorData.currentRoomId } title={ LocalizeText('room.history.button.back.tooltip') } className={ `icon ${ (roomHistory?.length === 0 || roomHistory[0]?.roomId === navigatorData.currentRoomId) ? 'icon-room-history-back-disabled' : 'icon-room-history-back-enabled' }` } onClick={ () => (roomHistory?.length === 0 || roomHistory[0]?.roomId === navigatorData.currentRoomId) ? null : handleToolClick('room_history_back') } />
                            <Base pointer={ roomHistory?.length > 0 } title={ LocalizeText('room.history.button.tooltip') } className={ `icon ${ roomHistory?.length === 0 ? 'icon-room-history-disabled' : 'icon-room-history-enabled' } margin-button-history` } onClick={ () => roomHistory?.length === 0 ? null : handleToolClick('room_history') } />
                            <Base pointer={ roomHistory.length > 1 && roomHistory[roomHistory.length - 1]?.roomId !== navigatorData.currentRoomId } title={ LocalizeText('room.history.button.forward.tooltip') } className={ `icon ${ (roomHistory?.length === 0 || roomHistory[roomHistory.length - 1]?.roomId === navigatorData.currentRoomId) ? 'icon-room-history-next-disabled' : 'icon-room-history-next-enabled' }` } onClick={ () => (roomHistory?.length === 0 || roomHistory[roomHistory.length - 1]?.roomId === navigatorData.currentRoomId) ? null : handleToolClick('room_history_next') } />
                        </Flex>
                    </Column>
                    <Flex className="nitro-room-tools-history" style={ { bottom: !navigatorData.canRate ? '180px' : '210px' } }>
                        <TransitionAnimation type={ TransitionAnimationTypes.SLIDE_LEFT } inProp={ isOpenHistory }>
                            <Column center>
                                <Column className="nitro-room-history rounded py-2 px-3">
                                    <Column gap={ 1 }>
                                        { (roomHistory.length > 0) && roomHistory.map(history =>
                                        {
                                            return <Text key={ history.roomId } bold={ history.roomId === navigatorData.currentRoomId } variant={ history.roomId === navigatorData.currentRoomId ? 'white' : 'muted' } pointer onClick={ () => TryVisitRoom(history.roomId) }>{ history.roomName }</Text>;
                                        }) }
                                    </Column>
                                </Column>
                            </Column>
                        </TransitionAnimation>
                    </Flex>
                    <Column justifyContent="center">
                        <TransitionAnimation type={ TransitionAnimationTypes.SLIDE_LEFT } inProp={ isOpen } timeout={ 300 }>
                            <Column center>
                                <Column className="nitro-room-tools-info rounded py-2 px-3">
                                    <Column gap={ 1 }>
                                        <Text wrap variant="white" fontSize={ 4 }>{ roomName }</Text>
                                        <Text variant="muted" fontSize={ 5 }>{ roomOwner }</Text>
                                    </Column>
                                    { roomTags && roomTags.length > 0 &&
                                        <Flex gap={ 2 }>
                                            { roomTags.map((tag, index) => <Text key={ index } small pointer variant="white" className="rounded bg-primary p-1" onClick={ () => handleToolClick('navigator_search_tag', tag) }>#{ tag }</Text>) }
                                        </Flex> }
                                </Column>
                            </Column>
                        </TransitionAnimation>
                    </Column>
                </>
            ) }
        </Flex>
    );
}
