import { BuildersClubFurniCountMessageEvent, BuildersClubQueryFurniCountMessageComposer, BuildersClubSubscriptionStatusMessageEvent } from '@nitrots/nitro-renderer';
import { useCallback, useEffect, useState } from 'react';
import { GetNitroInstance, SendMessageComposer } from '../../api';
import { UseMessageEventHook } from '../messages';

const useCatalogBuildersClubState = () =>
{
    const [ furniCount, setFurniCount ] = useState(0);
    const [ furniLimit, setFurniLimit ] = useState(0);
    const [ maxFurniLimit, setMaxFurniLimit ] = useState(0);
    const [ secondsLeft, setSecondsLeft ] = useState(0);
    const [ updateTime, setUpdateTime ] = useState(0);
    const [ secondsLeftWithGrace, setSecondsLeftWithGrace ] = useState(0);

    const refreshBuilderStatus = useCallback(() =>
    {

    }, []);

    const onBuildersClubFurniCountMessageEvent = useCallback((event: BuildersClubFurniCountMessageEvent) =>
    {
        const parser = event.getParser();

        setFurniCount(parser.furniCount);

        refreshBuilderStatus();
    }, [ refreshBuilderStatus ]);

    UseMessageEventHook(BuildersClubFurniCountMessageEvent, onBuildersClubFurniCountMessageEvent);

    const onBuildersClubSubscriptionStatusMessageEvent = useCallback((event: BuildersClubSubscriptionStatusMessageEvent) =>
    {
        const parser = event.getParser();

        setFurniLimit(parser._Str_15864);
        setMaxFurniLimit(parser._Str_24094);
        setSecondsLeft(parser._Str_3709);
        setUpdateTime(GetNitroInstance().time);
        setSecondsLeftWithGrace(parser._Str_24379);

        refreshBuilderStatus();
    }, [ refreshBuilderStatus ]);

    UseMessageEventHook(BuildersClubSubscriptionStatusMessageEvent, onBuildersClubSubscriptionStatusMessageEvent);

    useEffect(() =>
    {
        SendMessageComposer(new BuildersClubQueryFurniCountMessageComposer());
    }, []);

    return { furniCount, furniLimit, maxFurniLimit, secondsLeft, updateTime, secondsLeftWithGrace };
}

export const useCatalogBuildersClub = useCatalogBuildersClubState;
