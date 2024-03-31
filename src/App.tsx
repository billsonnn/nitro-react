import { GetAssetManager, GetAvatarRenderManager, GetCommunication, GetConfiguration, GetLocalizationManager, GetRoomCameraWidgetManager, GetRoomEngine, GetRoomSessionManager, GetSessionDataManager, GetSoundManager, GetStage, GetTexturePool, GetTicker, HabboWebTools, LegacyExternalInterface, LoadGameUrlEvent, NitroLogger, NitroVersion, PrepareRenderer } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { GetUIVersion } from './api';
import { Base } from './common';
import { LoadingView } from './components/loading/LoadingView';
import { MainView } from './components/main/MainView';
import { useMessageEvent } from './hooks';

NitroVersion.UI_VERSION = GetUIVersion();

export const App: FC<{}> = props =>
{
    const [ isReady, setIsReady ] = useState(false);

    useMessageEvent<LoadGameUrlEvent>(LoadGameUrlEvent, event =>
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
                if(!window.NitroConfig) throw new Error('NitroConfig is not defined!');

                const renderer = await PrepareRenderer({
                    width,
                    height,
                    autoDensity: true,
                    backgroundAlpha: 0,
                    preference: 'webgl',
                    resolution: window.devicePixelRatio
                });

                await GetConfiguration().init();

                GetTicker().maxFPS = GetConfiguration().getValue<number>('system.fps.max', 24);
                NitroLogger.LOG_DEBUG = GetConfiguration().getValue<boolean>('system.log.debug', true);
                NitroLogger.LOG_WARN = GetConfiguration().getValue<boolean>('system.log.warn', false);
                NitroLogger.LOG_ERROR = GetConfiguration().getValue<boolean>('system.log.error', false);
                NitroLogger.LOG_EVENTS = GetConfiguration().getValue<boolean>('system.log.events', false);
                NitroLogger.LOG_PACKETS = GetConfiguration().getValue<boolean>('system.log.packets', false);

                const assetUrls = GetConfiguration().getValue<string[]>('preload.assets.urls').map(url => GetConfiguration().interpolate(url)) ?? [];

                await Promise.all(
                    [
                        GetAssetManager().downloadAssets(assetUrls),
                        GetLocalizationManager().init(),
                        GetAvatarRenderManager().init(),
                        GetSoundManager().init(),
                        GetSessionDataManager().init(),
                        GetRoomSessionManager().init(),
                        GetRoomCameraWidgetManager().init()
                    ]
                );

                await GetRoomEngine().init();
                await GetCommunication().init();

                // new GameMessageHandler();

                if(LegacyExternalInterface.available) LegacyExternalInterface.call('legacyTrack', 'authentication', 'authok', []);

                HabboWebTools.sendHeartBeat();

                setInterval(() => HabboWebTools.sendHeartBeat(), 10000);

                GetTicker().add(ticker => GetRoomEngine().update(ticker));
                GetTicker().add(ticker => renderer.render(GetStage()));
                GetTicker().add(ticker => GetTexturePool().run());

                setIsReady(true);

                // handle socket close
                //canvas.addEventListener('webglcontextlost', () => instance.events.dispatchEvent(new NitroEvent(Nitro.WEBGL_CONTEXT_LOST)));
            }

            catch(err)
            {
                NitroLogger.error(err);
            }
        }

        prepare(window.innerWidth, window.innerHeight);
    }, []);
    
    return (
        <Base fit overflow="hidden" className={ !(window.devicePixelRatio % 1) && 'image-rendering-pixelated' }>
            { !isReady &&
                <LoadingView /> }
            { isReady && <MainView /> }
            <Base id="draggable-windows-container" />
        </Base>
    );
}
