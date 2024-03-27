import { GetAvatarRenderManager, GetCommunication, GetConfiguration, GetLocalizationManager, GetRoomEngine, GetRoomSessionManager, GetSessionDataManager, GetSoundManager, GetStage, GetTicker, HabboWebTools, LegacyExternalInterface, LoadGameUrlEvent, NitroLogger, NitroVersion, PrepareRenderer } from '@nitrots/nitro-renderer';
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
    const [ message, setMessage ] = useState('Getting Ready');
    const [ imageRendering, setImageRendering ] = useState<boolean>(true);

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

                GetTicker().add(ticker => renderer.render(GetStage()));

                await GetConfiguration().init();

                GetTicker().maxFPS = GetConfiguration().getValue<number>('system.fps.max', 24);
                NitroLogger.LOG_DEBUG = GetConfiguration().getValue<boolean>('system.log.debug', true);
                NitroLogger.LOG_WARN = GetConfiguration().getValue<boolean>('system.log.warn', false);
                NitroLogger.LOG_ERROR = GetConfiguration().getValue<boolean>('system.log.error', false);
                NitroLogger.LOG_EVENTS = GetConfiguration().getValue<boolean>('system.log.events', false);
                NitroLogger.LOG_PACKETS = GetConfiguration().getValue<boolean>('system.log.packets', false);
                
                await GetLocalizationManager().init();
                await GetAvatarRenderManager().init();
                await GetSoundManager().init();
                await GetSessionDataManager().init();
                await GetRoomSessionManager().init();
                await GetRoomEngine().init();
                await GetCommunication().init();

                // new GameMessageHandler();

                if(LegacyExternalInterface.available) LegacyExternalInterface.call('legacyTrack', 'authentication', 'authok', []);

                HabboWebTools.sendHeartBeat();

                setInterval(() => HabboWebTools.sendHeartBeat(), 10000);

                setIsReady(true);

                // handle socket close
                //canvas.addEventListener('webglcontextlost', () => instance.events.dispatchEvent(new NitroEvent(Nitro.WEBGL_CONTEXT_LOST)));
            }

            catch(err)
            {
                NitroLogger.error(err);
            }
        }
    
        const resize = (event: UIEvent) => setImageRendering(!(window.devicePixelRatio % 1));

        window.addEventListener('resize', resize);

        resize(null);

        prepare(window.innerWidth, window.innerHeight);

        return () =>
        {
            window.removeEventListener('resize', resize);
        }
    }, []);

    useMessageEvent<LoadGameUrlEvent>(LoadGameUrlEvent, event =>
    {
        const parser = event.getParser();

        if(!parser) return;

        LegacyExternalInterface.callGame('showGame', parser.url);
    });
    
    return (
        <Base fit overflow="hidden" className={ imageRendering && 'image-rendering-pixelated' }>
            { !isReady &&
                <LoadingView isError={ false } message={ message } percent={ 0 } showPercent={ false } /> }
            { isReady && <MainView /> }
            <Base id="draggable-windows-container" />
        </Base>
    );
}
