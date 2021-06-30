import { WiredFurniActionEvent, WiredFurniConditionEvent, WiredFurniTriggerEvent, WiredOpenEvent, WiredRewardResultMessageEvent, WiredSaveSuccessEvent, WiredValidationErrorEvent } from 'nitro-renderer';
import { FC, useCallback } from 'react';
import { CreateMessageHook } from '../../hooks/messages';
import { useWiredContext } from './context/WiredContext';

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
    }, []);

    const onWiredRewardResultMessageEvent = useCallback((event: WiredRewardResultMessageEvent) =>
    {
        const parser = event.getParser();
    }, []);

    const onWiredSaveSuccessEvent = useCallback((event: WiredSaveSuccessEvent) =>
    {
        const parser = event.getParser();

        setTrigger(null);
    }, [ setTrigger ]);

    const onWiredValidationErrorEvent = useCallback((event: WiredValidationErrorEvent) =>
    {
        const parser = event.getParser();
    }, []);

    CreateMessageHook(WiredFurniActionEvent, onWiredFurniActionEvent);
    CreateMessageHook(WiredFurniConditionEvent, onWiredFurniConditionEvent);
    CreateMessageHook(WiredFurniTriggerEvent, onWiredFurniTriggerEvent);
    CreateMessageHook(WiredOpenEvent, onWiredOpenEvent);
    CreateMessageHook(WiredRewardResultMessageEvent, onWiredRewardResultMessageEvent);
    CreateMessageHook(WiredSaveSuccessEvent, onWiredSaveSuccessEvent);
    CreateMessageHook(WiredValidationErrorEvent, onWiredValidationErrorEvent);

    return null;
};
