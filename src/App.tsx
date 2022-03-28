import { ConfigurationEvent, HabboWebTools, LegacyExternalInterface, Nitro, NitroCommunicationDemoEvent, NitroEvent, NitroLocalizationEvent, NitroVersion, RoomEngineEvent, WebGL } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { GetCommunication, GetConfiguration, GetNitroInstance, GetUIVersion } from './api';
import { Base, TransitionAnimation, TransitionAnimationTypes } from './common';
import { LoadingView } from './components/loading/LoadingView';
import { MainView } from './components/main/MainView';
import { DispatchUiEvent, UseConfigurationEvent, UseLocalizationEvent, UseMainEvent, UseRoomEngineEvent } from './hooks';
import IntervalWebWorker from './workers/IntervalWebWorker';
import { WorkerBuilder } from './workers/WorkerBuilder';

NitroVersion.UI_VERSION = GetUIVersion();

export const App: FC<{}> = props =>
{
    const [ isReady, setIsReady ] = useState(false);
    const [ isError, setIsError ] = useState(false);
    const [message, setMessage] = useState('Getting Ready');
    const [percent, setPercent] = useState(0);

    //@ts-ignore
    if(!NitroConfig) throw new Error('NitroConfig is not defined!');

    if(!GetNitroInstance())
    {
        Nitro.bootstrap();

        const worker = new WorkerBuilder(IntervalWebWorker);

        Nitro.instance.setWorker(worker);
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

    const loadPercent = useCallback(() => setPercent(prevValue => (prevValue + 20)), []);

    const handler = useCallback((event: NitroEvent) =>
    {
        switch(event.type)
        {
            case ConfigurationEvent.LOADED:
                GetNitroInstance().localization.init();
                loadPercent();
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
                loadPercent();
				return;
			case NitroCommunicationDemoEvent.CONNECTION_HANDSHAKE_FAILED:
                setIsError(true);
                setMessage('Handshake Failed');
				return;
			case NitroCommunicationDemoEvent.CONNECTION_AUTHENTICATED:
                loadPercent();

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
                loadPercent();

                setTimeout(() => setIsReady(true), 300);
                return;
            case NitroLocalizationEvent.LOADED:
                GetNitroInstance().core.asset.downloadAssets(getPreloadAssetUrls(), (status: boolean) =>
                {
                    if(status)
                    {
                        GetCommunication().init();

                        loadPercent();
                    }
                    else
                    {
                        setIsError(true);
                        setMessage('Assets Failed');
                    }
                });
                return;
        }
    }, [ getPreloadAssetUrls,loadPercent ]);

    UseMainEvent(Nitro.WEBGL_UNAVAILABLE, handler);
    UseMainEvent(Nitro.WEBGL_CONTEXT_LOST, handler);
    UseMainEvent(NitroCommunicationDemoEvent.CONNECTION_HANDSHAKING, handler);
    UseMainEvent(NitroCommunicationDemoEvent.CONNECTION_HANDSHAKE_FAILED, handler);
    UseMainEvent(NitroCommunicationDemoEvent.CONNECTION_AUTHENTICATED, handler);
    UseMainEvent(NitroCommunicationDemoEvent.CONNECTION_ERROR, handler);
    UseMainEvent(NitroCommunicationDemoEvent.CONNECTION_CLOSED, handler);
    UseRoomEngineEvent(RoomEngineEvent.ENGINE_INITIALIZED, handler);
    UseLocalizationEvent(NitroLocalizationEvent.LOADED, handler);
    UseConfigurationEvent(ConfigurationEvent.LOADED, handler);
    UseConfigurationEvent(ConfigurationEvent.FAILED, handler);

    if(!WebGL.isWebGLAvailable())
    {
        DispatchUiEvent(new NitroEvent(Nitro.WEBGL_UNAVAILABLE));
    }
    else
    {
        GetNitroInstance().core.configuration.init();
    }
    
    return (
        <Base fit overflow="hidden">
            { (!isReady || isError) &&
                <LoadingView isError={isError} message={message} percent={ percent } /> }
            <TransitionAnimation type={ TransitionAnimationTypes.FADE_IN } inProp={ (isReady) }>
                <MainView />
            </TransitionAnimation>
            <Base id="draggable-windows-container" />
        </Base>
    );
}
