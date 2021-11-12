import { ControlYoutubeDisplayPlaybackMessageComposer, SetYoutubeDisplayPlaylistMessageComposer, YoutubeControlVideoMessageEvent, YoutubeDisplayPlaylist, YoutubeDisplayPlaylistsEvent, YoutubeDisplayVideoMessageEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback, useMemo, useState } from 'react';
import YouTube, { Options } from 'react-youtube';
import { LocalizeText } from '../../../../../api';
import { RoomWidgetUpdateYoutubeDisplayEvent } from '../../../../../api/nitro/room/widgets/events/RoomWidgetUpdateYoutubeDisplayEvent';
import { FurnitureYoutubeDisplayWidgetHandler } from '../../../../../api/nitro/room/widgets/handlers/FurnitureYoutubeDisplayWidgetHandler';
import { BatchUpdates, CreateEventDispatcherHook, CreateMessageHook, SendMessageHook } from '../../../../../hooks';
import { NitroCardContentView, NitroCardGridItemView, NitroCardGridView, NitroCardHeaderView, NitroCardView } from '../../../../../layout';
import { useRoomContext } from '../../../context/RoomContext';
import { YoutubeVideoPlaybackStateEnum } from './utils/YoutubeVideoPlaybackStateEnum';

export const FurnitureYoutubeDisplayView: FC<{}> = props =>
{
    const [objectId, setObjectId] = useState(-1);
    const [videoId, setVideoId] = useState<string>(null);
    const [videoStart, setVideoStart] = useState<number>(null);
    const [videoEnd, setVideoEnd] = useState<number>(null);
    const [currentVideoState, setCurrentVideoState] = useState(-1);
    const [selectedItem, setSelectedItem] = useState<string>(null);
    const [playlists, setPlaylists] = useState<YoutubeDisplayPlaylist[]>(null);
    const [hasControl, setHasControl] = useState(false);
    const [player, setPlayer] = useState<any>(null);
    const { eventDispatcher = null } = useRoomContext();

    const onRoomWidgetUpdateYoutubeDisplayEvent = useCallback((event: RoomWidgetUpdateYoutubeDisplayEvent) =>
    {
        switch(event.type)
        {
            case RoomWidgetUpdateYoutubeDisplayEvent.UPDATE_YOUTUBE_DISPLAY: {
                setObjectId(event.objectId);
                setHasControl(event.hasControl);
            }
        }
    }, []);

    const close = useCallback(() =>
    {
        setObjectId(-1);
        setSelectedItem(null);
        setPlaylists(null);
        setHasControl(false);
        setVideoId(null);
        setVideoEnd(null);
        setVideoStart(null);
        setCurrentVideoState(-1);
    }, []);

    CreateEventDispatcherHook(RoomWidgetUpdateYoutubeDisplayEvent.UPDATE_YOUTUBE_DISPLAY, eventDispatcher, onRoomWidgetUpdateYoutubeDisplayEvent);

    const onVideo = useCallback((event: YoutubeDisplayVideoMessageEvent) =>
    {
        if(objectId === -1) return;

        const parser = event.getParser();

        if(objectId !== parser.furniId) return;

        BatchUpdates(() =>
        {
            setVideoId(parser.videoId);
            setVideoStart(parser.startAtSeconds);
            setVideoEnd(parser.endAtSeconds);
            setCurrentVideoState(parser.state);
        });
    }, [objectId]);

    const onPlaylists = useCallback((event: YoutubeDisplayPlaylistsEvent) =>
    {
        if(objectId === -1) return;

        const parser = event.getParser();

        if(objectId !== parser.furniId) return;

        BatchUpdates(() =>
        {
            setPlaylists(parser.playlists);
            setSelectedItem(parser.selectedPlaylistId);
            setVideoId(null);
            setCurrentVideoState(-1);
            setVideoEnd(null);
            setVideoStart(null);
        });
    }, [objectId]);

    const onControlVideo = useCallback((event: YoutubeControlVideoMessageEvent) =>
    {
        if(objectId === -1) return;

        const parser = event.getParser();

        if(objectId !== parser.furniId) return;

        switch(parser.commandId)
        {
            case 1:
                setCurrentVideoState(YoutubeVideoPlaybackStateEnum.PLAYING);
                if(player.getPlayerState() !== YoutubeVideoPlaybackStateEnum.PLAYING)
                    player.playVideo();
                break;
            case 2:
                setCurrentVideoState(YoutubeVideoPlaybackStateEnum.PAUSED);
                if(player.getPlayerState() !== YoutubeVideoPlaybackStateEnum.PAUSED)
                    player.pauseVideo();
                break;
        }
    }, [objectId, player]);

    CreateMessageHook(YoutubeDisplayVideoMessageEvent, onVideo);
    CreateMessageHook(YoutubeDisplayPlaylistsEvent, onPlaylists);
    CreateMessageHook(YoutubeControlVideoMessageEvent, onControlVideo);

    const processAction = useCallback((action: string) =>
    {
        switch(action)
        {
            case 'playlist_prev':
                SendMessageHook(new ControlYoutubeDisplayPlaybackMessageComposer(objectId, FurnitureYoutubeDisplayWidgetHandler.CONTROL_COMMAND_PREVIOUS_VIDEO));
                break;
            case 'playlist_next':
                SendMessageHook(new ControlYoutubeDisplayPlaybackMessageComposer(objectId, FurnitureYoutubeDisplayWidgetHandler.CONTROL_COMMAND_NEXT_VIDEO));
                break;
            case 'video_pause':
                if(hasControl && videoId && videoId.length)
                {
                    SendMessageHook(new ControlYoutubeDisplayPlaybackMessageComposer(objectId, FurnitureYoutubeDisplayWidgetHandler.CONTROL_COMMAND_PAUSE_VIDEO));
                }
                break;
            case 'video_play':
                if(hasControl && videoId && videoId.length)
                {
                    SendMessageHook(new ControlYoutubeDisplayPlaybackMessageComposer(objectId, FurnitureYoutubeDisplayWidgetHandler.CONTROL_COMMAND_CONTINUE_VIDEO));
                }
                break;
            default:
                if(selectedItem === action)
                {
                    setSelectedItem(null);
                    SendMessageHook(new SetYoutubeDisplayPlaylistMessageComposer(objectId, ''));
                    return;
                }
                SendMessageHook(new SetYoutubeDisplayPlaylistMessageComposer(objectId, action));
                setSelectedItem(action);
        }
    }, [hasControl, objectId, selectedItem, videoId]);

    const onReady = useCallback((event: any) =>
    {
        setPlayer(event.target);
    }, []);

    const onStateChange = useCallback((event: any) =>
    {
        setPlayer(event.target);
        if(objectId)
        {
            switch(event.target.getPlayerState())
            {
                case -1:
                case 1:
                    if(currentVideoState === 2)
                    {
                        //event.target.pauseVideo();
                    }
                    if(currentVideoState !== 1)
                    {
                        processAction('video_play');
                    }
                    return;
                case 2:
                    if(currentVideoState !== 2)
                    {
                        processAction('video_pause');
                    }
            }
        }
    }, [currentVideoState, objectId, processAction]);

    const getYoutubeOpts = useMemo( () =>
    {
        if(!videoStart && !videoEnd)
        {
            return {
                height: '375',
                width: '500',
                playerVars: {
                    autoplay: 1,
                    disablekb: 1,
                    controls: 0,
                    origin: window.origin,
                    modestbranding: 1
                }
            }
        }
       
        return {
            height: '375',
            width: '500',
            playerVars: {
                autoplay: 1,
                disablekb: 1,
                controls: 0,
                origin: window.origin,
                modestbranding: 1,
                start: videoStart,
                end: videoEnd
            }
        }
    }, [videoEnd, videoStart]);

    if((objectId === -1)) return null;

    return (
        <NitroCardView className="youtube-tv-widget">
            <NitroCardHeaderView headerText={''} onCloseClick={close} />
            <NitroCardContentView>
                <div className="row w-100 h-100">
                    <div className="youtube-video-container col-9">
                        {(videoId && videoId.length > 0) &&
                            <YouTube videoId={videoId} opts={getYoutubeOpts as Options} onReady={onReady} onStateChange={onStateChange} containerClassName={'youtubeContainer'} />
                        }
                        {(!videoId || videoId.length === 0) &&
                            <div className="empty-video w-100 h-100 justify-content-center align-items-center d-flex">{LocalizeText('widget.furni.video_viewer.no_videos')}</div>
                        }
                    </div>
                    <div className="playlist-container col-3">
                        <span className="playlist-controls justify-content-center d-flex">
                            <i className="icon icon-youtube-prev cursor-pointer" onClick={() => processAction('playlist_prev')} />
                            <i className="icon icon-youtube-next cursor-pointer" onClick={() => processAction('playlist_next')} />
                        </span>
                        <div className="mb-1">{LocalizeText('widget.furni.video_viewer.playlists')}</div>
                        <NitroCardGridView columns={1} className="playlist-grid">
                            {playlists && playlists.map((entry, index) =>
                            {
                                return (
                                    <NitroCardGridItemView key={index} onClick={() => processAction(entry.video)} itemActive={entry.video === selectedItem}>
                                        <b>{entry.title}</b> - {entry.description}
                                    </NitroCardGridItemView>
                                )
                            })}
                        </NitroCardGridView>
                    </div>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    )
}
