import { ControlYoutubeDisplayPlaybackMessageComposer, SetYoutubeDisplayPlaylistMessageComposer, YoutubeControlVideoMessageEvent, YoutubeDisplayPlaylist, YoutubeDisplayPlaylistsEvent, YoutubeDisplayVideoMessageEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { RoomWidgetUpdateYoutubeDisplayEvent } from '../../../../../api/nitro/room/widgets/events/RoomWidgetUpdateYoutubeDisplayEvent';
import { FurnitureYoutubeDisplayWidgetHandler } from '../../../../../api/nitro/room/widgets/handlers/FurnitureYoutubeDisplayWidgetHandler';
import { CreateEventDispatcherHook, CreateMessageHook, SendMessageHook } from '../../../../../hooks';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../../layout';
import { useRoomContext } from '../../../context/RoomContext';

export const FurnitureYoutubeDisplayView: FC<{}> = props =>
{
    const [objectId, setObjectId] = useState(-1);
    const [videoUrl, setVideoUrl] = useState<string>(null);
    const [selectedItem, setSelectedItem] = useState<string>(null);
    const [playlists, setPlaylists] = useState<YoutubeDisplayPlaylist[]>(null);
    const { eventDispatcher = null } = useRoomContext();

    const onRoomWidgetUpdateYoutubeDisplayEvent = useCallback((event: RoomWidgetUpdateYoutubeDisplayEvent) =>
    {
        switch(event.type)
        {
            case RoomWidgetUpdateYoutubeDisplayEvent.UPDATE_YOUTUBE_DISPLAY: {
                setObjectId(event.objectId);
            }
        }
    }, []);

    const close = useCallback(() =>
    {
        setObjectId(-1);
        setVideoUrl(null)
        setSelectedItem(null);
        setPlaylists(null);
    }, []);

    CreateEventDispatcherHook(RoomWidgetUpdateYoutubeDisplayEvent.UPDATE_YOUTUBE_DISPLAY, eventDispatcher, onRoomWidgetUpdateYoutubeDisplayEvent);

    const onVideo = useCallback((event: YoutubeDisplayVideoMessageEvent) =>
    {
        if(objectId === -1) return;

        const parser = event.getParser();

        if(objectId !== parser.furniId) return;

        if(parser.endAtSeconds > 0 || parser.startAtSeconds > 0)
        {
            setVideoUrl(`https://www.youtube.com/embed/${parser.videoId}?start=${parser.startAtSeconds}&end=${parser.endAtSeconds}?autoplay=1`);
        }
        else
        {
            setVideoUrl(`https://www.youtube.com/embed/${parser.videoId}?autoplay=1`);
        }

    }, [objectId]);

    const onPlaylists = useCallback((event: YoutubeDisplayPlaylistsEvent) =>
    {
        if(objectId === -1) return;

        const parser = event.getParser();

        if(objectId !== parser.furniId) return;

        setPlaylists(parser.playlists);
        setSelectedItem(parser.selectedPlaylistId);
        setVideoUrl(null);
    }, [objectId]);

    const onControlVideo = useCallback((event: YoutubeControlVideoMessageEvent) =>
    {
        if(objectId === -1) return;

        const parser = event.getParser();
        console.log(parser);

        if(objectId !== parser.furniId) return;

        switch(parser.commandId)
        {
            case 1:
                //this._currentVideoPlaybackState = YoutubeVideoPlaybackStateEnum._Str_5825;
                //this._player.playVideo();
                return;
            case 2:
                //this._currentVideoPlaybackState = YoutubeVideoPlaybackStateEnum._Str_6168;
                //this._player.pauseVideo();
                return;
        }
    }, [objectId]);

    CreateMessageHook(YoutubeDisplayVideoMessageEvent, onVideo);
    CreateMessageHook(YoutubeDisplayPlaylistsEvent, onPlaylists);
    CreateMessageHook(YoutubeControlVideoMessageEvent, onControlVideo);

    const processAction = useCallback( (action: string) =>
    {
        switch(action)
        {
            case 'playlist_prev':
                SendMessageHook(new ControlYoutubeDisplayPlaybackMessageComposer(objectId, FurnitureYoutubeDisplayWidgetHandler.CONTROL_COMMAND_PREVIOUS_VIDEO));
                break;
            case 'playlist_next':
                SendMessageHook(new ControlYoutubeDisplayPlaybackMessageComposer(objectId, FurnitureYoutubeDisplayWidgetHandler.CONTROL_COMMAND_NEXT_VIDEO));
                break;
            default:
                SendMessageHook(new SetYoutubeDisplayPlaylistMessageComposer(objectId, action));
                setSelectedItem(action);
        }
    }, [objectId]);

    if((objectId === -1)) return null;

    console.log(objectId);
    return (
        <NitroCardView className="youtube-tv-widget">
            <NitroCardHeaderView headerText={''} onCloseClick={close} />
            <NitroCardContentView>
                <div className="row w-100 h-100">
                    <div className="youtube-video-container col-9">
                        {videoUrl && videoUrl.length > 0 &&
                            <iframe title="yt" width="100%" height="100%" src={videoUrl} frameBorder="0" allowFullScreen allow="autoplay" />
                        }
                    </div>
                    <div className="playlist-container col-3">
                        <span className="playlist-controls justify-content-center d-flex">
                            <i className="icon icon-youtube-prev cursor-pointer" onClick={(e) => processAction('playlist_prev')} />
                            <i className="icon icon-youtube-next cursor-pointer" onClick={(e) => processAction('playlist_next')} />
                        </span>
                        <div className="playlist-list">
                            {playlists && playlists.map(entry =>
                            {
                                return <div className={'playlist-entry cursor-pointer ' + (entry.video === selectedItem ? 'selected' : '')}  key={entry.video} onClick={(e) => processAction(entry.video)}><b>{entry.title}</b> - {entry.description}</div>
                            })}
                        </div>
                    </div>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    )
}
