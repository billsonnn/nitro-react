import { WiredFurniActionEvent, WiredFurniConditionEvent, WiredFurniTriggerEvent, WiredOpenEvent, WiredRewardResultMessageEvent, WiredSaveSuccessEvent, WiredValidationErrorEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback } from 'react';
import { LocalizeText, NotificationAlertType, NotificationUtilities } from '../../api';
import { UseMessageEventHook } from '../../hooks/messages';
import { useWiredContext } from './WiredContext';

export const WiredMessageHandler: FC<{}> = props =>
{
    const { setTrigger = null } = useWiredContext();

    const onWiredFurniActionEvent = useCallback((event: WiredFurniActionEvent) =>
    {
        const parser = event.getParser();

        setTrigger(parser.definition);
    }, [ setTrigger ]);

    const onWiredFurniConditionEvent = useCallback((event: WiredFurniConditionEvent) =>
    {
        const parser = event.getParser();

        setTrigger(parser.definition);
    }, [ setTrigger ]);

    const onWiredFurniTriggerEvent = useCallback((event: WiredFurniTriggerEvent) =>
    {
        const parser = event.getParser();

        setTrigger(parser.definition);
    }, [ setTrigger ]);

    const onWiredOpenEvent = useCallback((event: WiredOpenEvent) =>
    {
        const parser = event.getParser();

        console.log(parser);
    }, []);

    const onWiredRewardResultMessageEvent = useCallback((event: WiredRewardResultMessageEvent) =>
    {
        const parser = event.getParser();

        console.log(parser);
    }, []);

    const onWiredSaveSuccessEvent = useCallback((event: WiredSaveSuccessEvent) =>
    {
        setTrigger(null);
    }, [ setTrigger ]);

    const onWiredValidationErrorEvent = useCallback((event: WiredValidationErrorEvent) =>
    {
        const parser = event.getParser();

        NotificationUtilities.simpleAlert(parser.info, NotificationAlertType.DEFAULT, null, null, LocalizeText('error.title'));
        console.log(parser);
    }, []);

    UseMessageEventHook(WiredFurniActionEvent, onWiredFurniActionEvent);
    UseMessageEventHook(WiredFurniConditionEvent, onWiredFurniConditionEvent);
    UseMessageEventHook(WiredFurniTriggerEvent, onWiredFurniTriggerEvent);
    UseMessageEventHook(WiredOpenEvent, onWiredOpenEvent);
    UseMessageEventHook(WiredRewardResultMessageEvent, onWiredRewardResultMessageEvent);
    UseMessageEventHook(WiredSaveSuccessEvent, onWiredSaveSuccessEvent);
    UseMessageEventHook(WiredValidationErrorEvent, onWiredValidationErrorEvent);

    return null;
};
