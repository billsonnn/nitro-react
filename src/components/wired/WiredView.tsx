import { ConditionDefinition, Triggerable, TriggerDefinition, UpdateActionMessageComposer, UpdateConditionMessageComposer, UpdateTriggerMessageComposer, WiredActionDefinition } from '@nitrots/nitro-renderer';
import { FC, useCallback, useMemo, useState } from 'react';
import { IsOwnerOfFloorFurniture } from '../../api';
import { WiredEvent } from '../../events';
import { useUiEvent } from '../../hooks/events';
import { SendMessageHook } from '../../hooks/messages';
import { GetWiredLayout } from './common/GetWiredLayout';
import { WiredContextProvider } from './context/WiredContext';
import { WiredMessageHandler } from './WiredMessageHandler';

export const WiredView: FC<{}> = props =>
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
        if(!IsOwnerOfFloorFurniture(trigger.id))
        {
            
        }
        
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
