import { ControlYoutubeDisplayPlaybackMessageComposer, GetYoutubeDisplayStatusMessageComposer, RoomEngineTriggerWidgetEvent, RoomId, SecurityLevel, SetYoutubeDisplayPlaylistMessageComposer, YoutubeControlVideoMessageEvent, YoutubeDisplayPlaylist, YoutubeDisplayPlaylistsEvent, YoutubeDisplayVideoMessageEvent } from '@nitrots/nitro-renderer';
import { useState } from 'react';
import { GetRoomEngine, GetSessionDataManager, IsOwnerOfFurniture, SendMessageComposer, YoutubeVideoPlaybackStateEnum } from '../../../../api';
import { useMessageEvent, useRoomEngineEvent } from '../../../events';
import { useFurniRemovedEvent } from '../../engine';

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

    const onClose = () =>
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

    useRoomEngineEvent<RoomEngineTriggerWidgetEvent>(RoomEngineTriggerWidgetEvent.REQUEST_YOUTUBE, event =>
    {
        if(RoomId.isRoomPreviewerId(event.roomId)) return;

        const roomObject = GetRoomEngine().getRoomObject(event.roomId, event.objectId, event.category);
    
        if(!roomObject) return;

        setObjectId(event.objectId);
        setCategory(event.category);
        setHasControl(GetSessionDataManager().hasSecurity(SecurityLevel.EMPLOYEE) || IsOwnerOfFurniture(roomObject));

        SendMessageComposer(new GetYoutubeDisplayStatusMessageComposer(event.objectId));
    });

    useMessageEvent<YoutubeDisplayVideoMessageEvent>(YoutubeDisplayVideoMessageEvent, event =>
    {
        const parser = event.getParser();

        if((objectId === -1) || (objectId !== parser.furniId)) return;

        setVideoId(parser.videoId);
        setVideoStart(parser.startAtSeconds);
        setVideoEnd(parser.endAtSeconds);
        setCurrentVideoState(parser.state);
    });

    useMessageEvent<YoutubeDisplayPlaylistsEvent>(YoutubeDisplayPlaylistsEvent, event =>
    {
        const parser = event.getParser();

        if((objectId === -1) || (objectId !== parser.furniId)) return;

        setPlaylists(parser.playlists);
        setSelectedVideo(parser.selectedPlaylistId);
        setVideoId(null);
        setCurrentVideoState(-1);
        setVideoEnd(null);
        setVideoStart(null);
    });

    useMessageEvent<YoutubeControlVideoMessageEvent>(YoutubeControlVideoMessageEvent, event =>
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
    });

    useFurniRemovedEvent(((objectId !== -1) && (category !== -1)), event =>
    {
        if((event.id !== objectId) || (event.category !== category)) return;

        onClose();
    });

    return { objectId, videoId, videoStart, videoEnd, currentVideoState, selectedVideo, playlists, onClose, previous, next, pause, play, selectVideo };
}

export const useFurnitureYoutubeWidget = useFurnitureYoutubeWidgetState;
