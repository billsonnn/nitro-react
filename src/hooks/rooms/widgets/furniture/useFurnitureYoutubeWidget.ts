import { ControlYoutubeDisplayPlaybackMessageComposer, GetYoutubeDisplayStatusMessageComposer, RoomEngineTriggerWidgetEvent, SecurityLevel, SetYoutubeDisplayPlaylistMessageComposer, YoutubeControlVideoMessageEvent, YoutubeDisplayPlaylist, YoutubeDisplayPlaylistsEvent, YoutubeDisplayVideoMessageEvent } from '@nitrots/nitro-renderer';
import { useCallback, useState } from 'react';
import { GetRoomEngine, GetSessionDataManager, IsOwnerOfFurniture, SendMessageComposer, YoutubeVideoPlaybackStateEnum } from '../../../../api';
import { UseRoomEngineEvent } from '../../../events';
import { UseMessageEventHook } from '../../../messages';
import { useFurniRemovedEvent } from '../../useFurniRemovedEvent';

const CONTROL_COMMAND_PREVIOUS_VIDEO = 0;
const CONTROL_COMMAND_NEXT_VIDEO = 1;
const CONTROL_COMMAND_PAUSE_VIDEO = 2;
const CONTROL_COMMAND_CONTINUE_VIDEO = 3;

const useFurnitureYoutubeWidgetState = () =>
{
    const [ objectId, setObjectId ] = useState(-1);
    const [ category, setCategory ] = useState(-1);
    const [ videoId, setVideoId ] = useState<string>(null);
    const [ videoStart, setVideoStart ] = useState<number>(null);
    const [ videoEnd, setVideoEnd ] = useState<number>(null);
    const [ currentVideoState, setCurrentVideoState ] = useState(-1);
    const [ selectedVideo, setSelectedVideo ] = useState<string>(null);
    const [ playlists, setPlaylists ] = useState<YoutubeDisplayPlaylist[]>(null);
    const [ hasControl, setHasControl ] = useState(false);

    const close = () =>
    {
        setObjectId(-1);
        setCategory(-1);
        setVideoId(null);
        setVideoStart(null);
        setVideoEnd(null);
        setCurrentVideoState(-1);
        setSelectedVideo(null);
        setPlaylists(null);
        setHasControl(false);
    }

    const previous = () => SendMessageComposer(new ControlYoutubeDisplayPlaybackMessageComposer(objectId, CONTROL_COMMAND_PREVIOUS_VIDEO));

    const next = () => SendMessageComposer(new ControlYoutubeDisplayPlaybackMessageComposer(objectId, CONTROL_COMMAND_NEXT_VIDEO));

    const pause = () => (hasControl && videoId && videoId.length) && SendMessageComposer(new ControlYoutubeDisplayPlaybackMessageComposer(objectId, CONTROL_COMMAND_PAUSE_VIDEO));

    const play = () => (hasControl && videoId && videoId.length) && SendMessageComposer(new ControlYoutubeDisplayPlaybackMessageComposer(objectId, CONTROL_COMMAND_CONTINUE_VIDEO));

    const selectVideo = (video: string) =>
    {
        if(selectedVideo === video)
        {
            setSelectedVideo(null);
            SendMessageComposer(new SetYoutubeDisplayPlaylistMessageComposer(objectId, ''));

            return;
        }

        setSelectedVideo(video);
        SendMessageComposer(new SetYoutubeDisplayPlaylistMessageComposer(objectId, video));
    }

    UseRoomEngineEvent<RoomEngineTriggerWidgetEvent>(RoomEngineTriggerWidgetEvent.REQUEST_YOUTUBE, event =>
    {
        const roomObject = GetRoomEngine().getRoomObject(event.roomId, event.objectId, event.category);

        console.log(roomObject);
    
        if(!roomObject) return;

        setObjectId(event.objectId);
        setCategory(event.category);
        setHasControl(GetSessionDataManager().hasSecurity(SecurityLevel.EMPLOYEE) || IsOwnerOfFurniture(roomObject));

        console.log('??')

        SendMessageComposer(new GetYoutubeDisplayStatusMessageComposer(event.objectId));
    });

    useFurniRemovedEvent(((objectId !== -1) && (category !== -1)), event =>
    {
        if((event.id !== objectId) || (event.category !== category)) return;

        close();
    });

    const onYoutubeDisplayVideoMessageEvent = useCallback((event: YoutubeDisplayVideoMessageEvent) =>
    {
        const parser = event.getParser();

        if((objectId === -1) || (objectId !== parser.furniId)) return;

        setVideoId(parser.videoId);
        setVideoStart(parser.startAtSeconds);
        setVideoEnd(parser.endAtSeconds);
        setCurrentVideoState(parser.state);
    }, [ objectId ]);

    UseMessageEventHook(YoutubeDisplayVideoMessageEvent, onYoutubeDisplayVideoMessageEvent);

    const onYoutubeDisplayPlaylistsEvent = useCallback((event: YoutubeDisplayPlaylistsEvent) =>
    {
        const parser = event.getParser();

        if((objectId === -1) || (objectId !== parser.furniId)) return;

        setPlaylists(parser.playlists);
        setSelectedVideo(parser.selectedPlaylistId);
        setVideoId(null);
        setCurrentVideoState(-1);
        setVideoEnd(null);
        setVideoStart(null);
    }, [ objectId ]);

    UseMessageEventHook(YoutubeDisplayPlaylistsEvent, onYoutubeDisplayPlaylistsEvent);

    const onYoutubeControlVideoMessageEvent = useCallback((event: YoutubeControlVideoMessageEvent) =>
    {
        const parser = event.getParser();

        if((objectId === -1) || (objectId !== parser.furniId)) return;

        switch(parser.commandId)
        {
            case 1:
                setCurrentVideoState(YoutubeVideoPlaybackStateEnum.PLAYING);
                break;
            case 2:
                setCurrentVideoState(YoutubeVideoPlaybackStateEnum.PAUSED);
                break;
        }
    }, [ objectId ]);

    UseMessageEventHook(YoutubeControlVideoMessageEvent, onYoutubeControlVideoMessageEvent);

    return { objectId, videoId, videoStart, videoEnd, currentVideoState, selectedVideo, playlists, close, previous, next, pause, play, selectVideo };
}

export const useFurnitureYoutubeWidget = useFurnitureYoutubeWidgetState;
