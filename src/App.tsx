import { ConfigurationEvent, GetAssetManager, HabboWebTools, LegacyExternalInterface, Nitro, NitroCommunicationDemoEvent, NitroConfiguration, NitroEvent, NitroLocalizationEvent, NitroVersion, RoomEngineEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { GetCommunication, GetConfiguration, GetNitroInstance, GetUIVersion } from './api';
import { Base, TransitionAnimation, TransitionAnimationTypes } from './common';
import { LoadingView } from './components/loading/LoadingView';
import { MainView } from './components/main/MainView';
import { useConfigurationEvent, useLocalizationEvent, useMainEvent, useRoomEngineEvent } from './hooks';

NitroVersion.UI_VERSION = GetUIVersion();

export const App: FC<{}> = props =>
{
    const [ isReady, setIsReady ] = useState(false);
    const [ isError, setIsError ] = useState(false);
    const [ message, setMessage ] = useState('Getting Ready');
    const [ percent, setPercent ] = useState(0);
    const [ imageRendering, setImageRendering ] = useState<boolean>(true);

    if(!GetNitroInstance())
    {
        //@ts-ignore
        if(!NitroConfig) throw new Error('NitroConfig is not defined!');

        Nitro.bootstrap();
    }

    const handler = useCallback(async (event: NitroEvent) =>
    {
        switch(event.type)
        {
            case ConfigurationEvent.LOADED:
                GetNitroInstance().localization.init();
                setPercent(prevValue => (prevValue + 20));
                return;
            case ConfigurationEvent.FAILED:
                setIsError(true);
                setMessage('Configuration Failed');
                return;
            case Nitro.WEBGL_UNAVAILABLE:
                setIsError(true);
                setMessage('WebGL Required');
                return;
            case Nitro.WEBGL_CONTEXT_LOST:
                setIsError(true);
                setMessage('WebGL Context Lost - Reloading');

                setTimeout(() => window.location.reload(), 1500);
                return;
            case NitroCommunicationDemoEvent.CONNECTION_HANDSHAKING:
                setPercent(prevValue => (prevValue + 20));
                return;
            case NitroCommunicationDemoEvent.CONNECTION_HANDSHAKE_FAILED:
                setIsError(true);
                setMessage('Handshake Failed');
                return;
            case NitroCommunicationDemoEvent.CONNECTION_AUTHENTICATED:
                setPercent(prevValue => (prevValue + 20));

                GetNitroInstance().init();

                if(LegacyExternalInterface.available) LegacyExternalInterface.call('legacyTrack', 'authentication', 'authok', []);
                return;
            case NitroCommunicationDemoEvent.CONNECTION_ERROR:
                setIsError(true);
                setMessage('Connection Error');
                return;
            case NitroCommunicationDemoEvent.CONNECTION_CLOSED:
                //if(GetNitroInstance().roomEngine) GetNitroInstance().roomEngine.dispose();
                //setIsError(true);
                setMessage('Connection Error');

                HabboWebTools.send(-1, 'client.init.handshake.fail');
                return;
            case RoomEngineEvent.ENGINE_INITIALIZED:
                setPercent(prevValue => (prevValue + 20));

                setTimeout(() => setIsReady(true), 300);
                return;
            case NitroLocalizationEvent.LOADED: {
                const assetUrls = GetConfiguration<string[]>('preload.assets.urls');
                const urls: string[] = [];

                if(assetUrls && assetUrls.length) for(const url of assetUrls) urls.push(NitroConfiguration.interpolate(url));

                const status = await GetAssetManager().downloadAssets(urls);
                
                if(status)
                {
                    GetCommunication().init();

                    setPercent(prevValue => (prevValue + 20))
                }
                else
                {
                    setIsError(true);
                    setMessage('Assets Failed');
                }
                return;
            }
        }
    }, []);

    useMainEvent(Nitro.WEBGL_UNAVAILABLE, handler);
    useMainEvent(Nitro.WEBGL_CONTEXT_LOST, handler);
    useMainEvent(NitroCommunicationDemoEvent.CONNECTION_HANDSHAKING, handler);
    useMainEvent(NitroCommunicationDemoEvent.CONNECTION_HANDSHAKE_FAILED, handler);
    useMainEvent(NitroCommunicationDemoEvent.CONNECTION_AUTHENTICATED, handler);
    useMainEvent(NitroCommunicationDemoEvent.CONNECTION_ERROR, handler);
    useMainEvent(NitroCommunicationDemoEvent.CONNECTION_CLOSED, handler);
    useRoomEngineEvent(RoomEngineEvent.ENGINE_INITIALIZED, handler);
    useLocalizationEvent(NitroLocalizationEvent.LOADED, handler);
    useConfigurationEvent(ConfigurationEvent.LOADED, handler);
    useConfigurationEvent(ConfigurationEvent.FAILED, handler);

    useEffect(() =>
    {
        GetNitroInstance().core.configuration.init();
    
        const resize = (event: UIEvent) => setImageRendering(!(window.devicePixelRatio % 1));

        window.addEventListener('resize', resize);

        resize(null);

        return () =>
        {
            window.removeEventListener('resize', resize);
        }
    }, []);
    
    return (
        <Base fit overflow="hidden" className={ imageRendering && 'image-rendering-pixelated' }>
            { (!isReady || isError) &&
                <LoadingView isError={ isError } message={ message } percent={ percent } /> }
            <TransitionAnimation type={ TransitionAnimationTypes.FADE_IN } inProp={ (isReady) }>
                <MainView />
            </TransitionAnimation>
            <Base id="draggable-windows-container" />
        </Base>
    );
}
