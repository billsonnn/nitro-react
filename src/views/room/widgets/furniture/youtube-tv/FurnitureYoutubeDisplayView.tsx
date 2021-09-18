import { YoutubeControlVideoMessageEvent, YoutubeDisplayPlaylistsEvent, YoutubeDisplayVideoMessageEvent } from '@nitrots/nitro-renderer/src/nitro/communication/messages/incoming/room/furniture/youtube';
import { FC, useCallback, useState } from 'react';
import { RoomWidgetUpdateYoutubeDisplayEvent } from '../../../../../api/nitro/room/widgets/events/RoomWidgetUpdateYoutubeDisplayEvent';
import { CreateEventDispatcherHook, CreateMessageHook } from '../../../../../hooks';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../../layout';
import { useRoomContext } from '../../../context/RoomContext';

export const FurnitureYoutubeDisplayView: FC<{}> = props =>
{
    const [objectId, setObjectId] = useState(-1);
    const [videoUrl, setVideoUrl] = useState<string>(null);
    const { eventDispatcher = null } = useRoomContext();

    const onRoomWidgetUpdateYoutubeDisplayEvent = useCallback((event: RoomWidgetUpdateYoutubeDisplayEvent) =>
    {
        switch(event.type)
        {
            case RoomWidgetUpdateYoutubeDisplayEvent.UPDATE_YOUTUBE_DISPLAY: {
                setObjectId(event.objectId);
                //setVideoUrl(event.videoUrl);
            }
        }
    }, []);

    const close = useCallback(() =>
    {
        setObjectId(-1);
        setVideoUrl(null)
    }, []);

    CreateEventDispatcherHook(RoomWidgetUpdateYoutubeDisplayEvent.UPDATE_YOUTUBE_DISPLAY, eventDispatcher, onRoomWidgetUpdateYoutubeDisplayEvent);

    const onVideo = useCallback((event: YoutubeDisplayVideoMessageEvent) =>
    {
        if(objectId === -1) return;

        const parser = event.getParser();
        console.log(parser);

        if(objectId !== parser.furniId) return;

        if(parser.endAtSeconds > 0 || parser.startAtSeconds > 0)
        {
            setVideoUrl(`https://www.youtube.com/embed/${parser.videoId}?start=${parser.startAtSeconds}&end=${parser.endAtSeconds}`);
        }
        else
        {
            setVideoUrl(`https://www.youtube.com/embed/${parser.videoId}`);
        }

    }, [objectId]);

    const onPlaylists = useCallback((event: YoutubeDisplayPlaylistsEvent) =>
    {
        if(objectId === -1) return;

        const parser = event.getParser();
        console.log(parser);

        if(objectId !== parser.furniId) return;

        let playListId = parser.selectedPlaylistId;
        if(playListId === '' && parser.playlists.length)
        {
            playListId = parser.playlists[0].video;
        }

        setVideoUrl(`https://www.youtube.com/embed?listType=playlist&list=${playListId}`);
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

    if((objectId === -1)) return null;

    console.log(objectId);
    return (
        <NitroCardView className="youtube-tv-widget">
            <NitroCardHeaderView headerText={''} onCloseClick={close} />
            <NitroCardContentView>
                <div className="row w-100">
                    <div className="youtube-video-container col-8">
                        <iframe title="yt" width="560" height="315" src={videoUrl} frameBorder="0" allowFullScreen allow="autoplay"></iframe>
                    </div>
                    <div className="playlist-container col-4">
                        lol
                    </div>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    )
}
