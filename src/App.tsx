import { ConfigurationEvent, LegacyExternalInterface, Nitro, NitroCommunicationDemoEvent, NitroEvent, NitroLocalizationEvent, NitroVersion, RoomEngineEvent, WebGL } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { GetCommunication, GetConfiguration, GetNitroInstance } from './api';
import { useConfigurationEvent } from './hooks/events/core/configuration/configuration-event';
import { useLocalizationEvent } from './hooks/events/nitro/localization/localization-event';
import { dispatchMainEvent, useMainEvent } from './hooks/events/nitro/main-event';
import { useRoomEngineEvent } from './hooks/events/nitro/room/room-engine-event';
import { TransitionAnimation, TransitionAnimationTypes } from './layout';
import { LoadingView } from './views/loading/LoadingView';
import { MainView } from './views/main/MainView';

export const App: FC<{}> = props =>
{
    const [ isReady, setIsReady ] = useState(false);
    const [ isError, setIsError ] = useState(false);
    const [ message, setMessage ] = useState('Getting Ready');

    //@ts-ignore
    if(!NitroConfig) throw new Error('NitroConfig is not defined!');

    if(!GetNitroInstance())
    {
        NitroVersion.UI_VERSION = '2.0.0';
        Nitro.bootstrap();
    }

    const getPreloadAssetUrls = useCallback(() =>
    {
        const urls: string[] = [];
        const assetUrls = GetConfiguration<string[]>('preload.assets.urls');

        if(assetUrls && assetUrls.length)
        {
            for(const url of assetUrls) urls.push(GetNitroInstance().core.configuration.interpolate(url));
        }

        return urls;
    }, []);

    const handler = useCallback((event: NitroEvent) =>
    {
        switch(event.type)
        {
            case ConfigurationEvent.LOADED:
                GetNitroInstance().localization.init();
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
				return;
			case NitroCommunicationDemoEvent.CONNECTION_HANDSHAKE_FAILED:
                setIsError(true);
                setMessage('Handshake Failed');
				return;
			case NitroCommunicationDemoEvent.CONNECTION_AUTHENTICATED:
                setMessage('Finishing Up');

                GetNitroInstance().init();
				return;
			case NitroCommunicationDemoEvent.CONNECTION_ERROR:
                setIsError(true);
                setMessage('Connection Error');
				return;
			case NitroCommunicationDemoEvent.CONNECTION_CLOSED:
                if(GetNitroInstance().roomEngine) GetNitroInstance().roomEngine.dispose();

                setIsError(true);
                setMessage('Connection Error');

                LegacyExternalInterface.call('disconnect', -1, 'client.init.handshake.fail');
                return;
            case RoomEngineEvent.ENGINE_INITIALIZED:
                setIsReady(true);
                return;
            case NitroLocalizationEvent.LOADED:
                GetNitroInstance().core.asset.downloadAssets(getPreloadAssetUrls(), (status: boolean) =>
                {
                    if(status)
                    {
                        setMessage('Connecting');
                        
                        GetCommunication().init();
                    }
                    else
                    {
                        setIsError(true);
                        setMessage('Assets Failed');
                    }
                });
                return;
        }
    }, [ getPreloadAssetUrls ]);

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

    if(!WebGL.isWebGLAvailable())
    {
        dispatchMainEvent(new NitroEvent(Nitro.WEBGL_UNAVAILABLE));
    }
    else
    {
        GetNitroInstance().core.configuration.init();
    }
    
    return (
        <div className="nitro-app overflow-hidden">
            { (!isReady || isError) && <LoadingView isError={ isError } message={ message } /> }
            <TransitionAnimation type={ TransitionAnimationTypes.FADE_IN } inProp={ (isReady && !isError) }>
                <MainView />
            </TransitionAnimation>
            <div id="draggable-windows-container" />
        </div>
    );
}
