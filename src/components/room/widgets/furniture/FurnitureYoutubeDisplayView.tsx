import { FC, useEffect, useState } from 'react';
import YouTube, { Options } from 'react-youtube';
import { YouTubePlayer } from 'youtube-player/dist/types';
import { LocalizeText, YoutubeVideoPlaybackStateEnum } from '../../../../api';
import { AutoGrid, AutoGridProps, LayoutGridItem, NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../common';
import { useFurnitureYoutubeWidget } from '../../../../hooks';

interface FurnitureYoutubeDisplayViewProps extends AutoGridProps
{

}

export const FurnitureYoutubeDisplayView: FC<{}> = FurnitureYoutubeDisplayViewProps =>
{
    const [ player, setPlayer ] = useState<any>(null);
    const { objectId = -1, videoId = null, videoStart = 0, videoEnd = 0, currentVideoState = null, selectedVideo = null, playlists = [], onClose = null, previous = null, next = null, pause = null, play = null, selectVideo = null } = useFurnitureYoutubeWidget();

    const onStateChange = (event: { target: YouTubePlayer; data: number }) =>
    {
        setPlayer(event.target);

        if(objectId === -1) return;

        switch(event.target.getPlayerState())
        {
            case -1:
            case 1:
                if(currentVideoState === 2)
                {
                    //event.target.pauseVideo();
                }

                if(currentVideoState !== 1) play();
                return;
            case 2:
                if(currentVideoState !== 2) pause();
        }
    };

    useEffect(() =>
    {
        if((currentVideoState === null) || !player) return;

        if((currentVideoState === YoutubeVideoPlaybackStateEnum.PLAYING) && (player.getPlayerState() !== YoutubeVideoPlaybackStateEnum.PLAYING))
        {
            player.playVideo();

            return;
        }

        if((currentVideoState === YoutubeVideoPlaybackStateEnum.PAUSED) && (player.getPlayerState() !== YoutubeVideoPlaybackStateEnum.PAUSED))
        {
            player.pauseVideo();

            return;
        }
    }, [ currentVideoState, player ]);

    if(objectId === -1) return null;

    const youtubeOptions: Options = {
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
    };

    return (
        <NitroCardView className="youtube-tv-widget">
            <NitroCardHeaderView headerText={ LocalizeText('catalog.page.youtube_tvs') } onCloseClick={ onClose } />
            <NitroCardContentView>
                <div className="row size-full">
                    <div className="youtube-video-container col-span-9 overflow-hidden">
                        { (videoId && videoId.length > 0) &&
                            <YouTube containerClassName={ 'youtubeContainer' } opts={ youtubeOptions } videoId={ videoId } onReady={ event => setPlayer(event.target) } onStateChange={ onStateChange } />
                        }
                        { (!videoId || videoId.length === 0) &&
                            <div className="empty-video size-full justify-center items-center flex">{ LocalizeText('widget.furni.video_viewer.no_videos') }</div>
                        }
                    </div>
                    <div className="playlist-container col-span-3 flex flex-col">
                        <span className="playlist-controls justify-center flex">
                            <i className="icon icon-youtube-prev cursor-pointer" onClick={ previous } />
                            <i className="icon icon-youtube-next cursor-pointer" onClick={ next } />
                        </span>
                        <div className="mb-1">{ LocalizeText('widget.furni.video_viewer.playlists') }</div>
                        <AutoGrid className="mb-1" columnCount={ 1 } columnMinHeight={ 100 } columnMinWidth={ 80 } overflow="auto">
                            { playlists && playlists.map((entry, index) =>
                            {
                                return (
                                    <LayoutGridItem key={ index } itemActive={ (entry.video === selectedVideo) } onClick={ event => selectVideo(entry.video) }>
                                        <b>{ entry.title }</b>
                                    </LayoutGridItem>
                                );
                            }) }
                        </AutoGrid>
                    </div>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    );
};
