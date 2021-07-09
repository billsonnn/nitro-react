import { ConditionDefinition, Triggerable, TriggerDefinition, UpdateActionMessageComposer, UpdateConditionMessageComposer, UpdateTriggerMessageComposer, WiredActionDefinition } from 'nitro-renderer';
import { FC, useCallback, useMemo, useState } from 'react';
import { WiredEvent } from '../../events';
import { useUiEvent } from '../../hooks/events';
import { SendMessageHook } from '../../hooks/messages';
import { GetWiredLayout } from './common/GetWiredLayout';
import { WiredContextProvider } from './context/WiredContext';
import { WiredMessageHandler } from './WiredMessageHandler';
import { WiredFurniSelectorViewProps } from './WiredView.types';

export const WiredView: FC<WiredFurniSelectorViewProps> = props =>
{
    const [ trigger, setTrigger ] = useState<Triggerable>(null);
    const [ intParams, setIntParams ] = useState<number[]>(null);
    const [ stringParam, setStringParam ] = useState<string>(null);
    const [ furniIds, setFurniIds ] = useState<number[]>([]);
    const [ actionDelay, setActionDelay ] = useState<number>(null);

    const wiredLayout = useMemo(() =>
    {
        return GetWiredLayout(trigger);
    }, [ trigger ]);

    const onWiredEvent = useCallback((event: WiredEvent) =>
    {
        // check if owner & warn with confirm
        
        if(trigger instanceof WiredActionDefinition)
        {
            SendMessageHook(new UpdateActionMessageComposer(trigger.id, intParams, stringParam, furniIds, actionDelay, trigger.stuffTypeSelectionCode));
        }

        else if(trigger instanceof TriggerDefinition)
        {
            SendMessageHook(new UpdateTriggerMessageComposer(trigger.id, intParams, stringParam, furniIds, trigger.stuffTypeSelectionCode));
        }

        else if(trigger instanceof ConditionDefinition)
        {
            SendMessageHook(new UpdateConditionMessageComposer(trigger.id, intParams, stringParam, furniIds, trigger.stuffTypeSelectionCode));
        }
    }, [ trigger, intParams, stringParam, furniIds, actionDelay ]);

    useUiEvent(WiredEvent.SAVE_WIRED, onWiredEvent);

    return (
        <WiredContextProvider value={ { trigger, setTrigger, intParams, setIntParams, stringParam, setStringParam, furniIds, setFurniIds, actionDelay, setActionDelay }}>
            <WiredMessageHandler />
            { wiredLayout }
        </WiredContextProvider>
    );
};
