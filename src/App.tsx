import
{
    GetAssetManager,
    GetAvatarRenderManager,
    GetCommunication,
    GetConfiguration,
    GetLocalizationManager,
    GetRoomCameraWidgetManager,
    GetRoomEngine,
    GetRoomSessionManager,
    GetSessionDataManager,
    GetSoundManager,
    GetStage,
    GetTexturePool,
    GetTicker,
    HabboWebTools,
    LegacyExternalInterface,
    LoadGameUrlEvent,
    NitroLogger,
    NitroVersion,
    PrepareRenderer,
} from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { GetUIVersion } from './api';
import { MainView } from './components/MainView';
import { LoadingView } from './components/loading/LoadingView';
import { useMessageEvent } from './hooks';
import { classNames } from './layout';

NitroVersion.UI_VERSION = GetUIVersion();

export const App: FC<{}> = (props) =>
{
    const [isReady, setIsReady] = useState(false);

    useMessageEvent<LoadGameUrlEvent>(LoadGameUrlEvent, (event) =>
    {
        const parser = event.getParser();

        if(!parser) return;

        LegacyExternalInterface.callGame('showGame', parser.url);
    });

    useEffect(() =>
    {
        const prepare = async (width: number, height: number) =>
        {
            try
            {
                if(!window.NitroConfig)
                    throw new Error('NitroConfig is not defined!');

                const renderer = await PrepareRenderer({
                    width: Math.floor(width),
                    height: Math.floor(height),
                    resolution: window.devicePixelRatio,
                    autoDensity: true,
                    backgroundAlpha: 0,
                    preference: 'webgl',
                    eventMode: 'none',
                    failIfMajorPerformanceCaveat: false,
                    roundPixels: true
                });

                await GetConfiguration().init();

                GetTicker().maxFPS = GetConfiguration().getValue<number>(
                    'system.fps.max',
                    24,
                );
                NitroLogger.LOG_DEBUG = GetConfiguration().getValue<boolean>(
                    'system.log.debug',
                    true,
                );
                NitroLogger.LOG_WARN = GetConfiguration().getValue<boolean>(
                    'system.log.warn',
                    false,
                );
                NitroLogger.LOG_ERROR = GetConfiguration().getValue<boolean>(
                    'system.log.error',
                    false,
                );
                NitroLogger.LOG_EVENTS = GetConfiguration().getValue<boolean>(
                    'system.log.events',
                    false,
                );
                NitroLogger.LOG_PACKETS = GetConfiguration().getValue<boolean>(
                    'system.log.packets',
                    false,
                );

                const assetUrls =
                    GetConfiguration()
                        .getValue<string[]>('preload.assets.urls')
                        .map((url) => GetConfiguration().interpolate(url)) ??
                    [];

                await Promise.all([
                    GetRoomCameraWidgetManager().init(),
                    GetAssetManager().downloadAssets(assetUrls),
                    GetLocalizationManager().init(),
                    GetAvatarRenderManager().init(),
                    GetSoundManager().init(),
                    GetSessionDataManager().init(),
                    GetRoomSessionManager().init(),
                    GetCommunication().init(),
                ]);

                await GetRoomEngine().init();

                // new GameMessageHandler();

                if(LegacyExternalInterface.available)
                    LegacyExternalInterface.call(
                        'legacyTrack',
                        'authentication',
                        'authok',
                        [],
                    );

                HabboWebTools.sendHeartBeat();

                setInterval(() => HabboWebTools.sendHeartBeat(), 10000);

                GetTicker().add((ticker) => GetRoomEngine().update(ticker));
                GetTicker().add((ticker) => renderer.render(GetStage()));
                GetTicker().add((ticker) => GetTexturePool().run());

                setIsReady(true);

                // handle socket close
                //canvas.addEventListener('webglcontextlost', () => instance.events.dispatchEvent(new NitroEvent(Nitro.WEBGL_CONTEXT_LOST)));
            }
            catch (err)
            {
                NitroLogger.error(err);
            }
        };

        prepare(window.innerWidth, window.innerHeight);
    }, []);

    return (
        <div
            className={classNames(
                'w-full h-full overflow-hidden text-base bg-black',
                !(window.devicePixelRatio % 1) && '[image-rendering:pixelated]',
            )}
        >
            {!isReady && <LoadingView />}
            {isReady && <MainView />}
            <div id="draggable-windows-container" />
        </div>
    );
};
