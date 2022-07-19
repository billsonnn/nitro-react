import { ConditionDefinition, Triggerable, TriggerDefinition, UpdateActionMessageComposer, UpdateConditionMessageComposer, UpdateTriggerMessageComposer, WiredActionDefinition, WiredFurniActionEvent, WiredFurniConditionEvent, WiredFurniTriggerEvent } from '@nitrots/nitro-renderer';
import { useState } from 'react';
import { useBetween } from 'use-between';
import { IsOwnerOfFloorFurniture, LocalizeText, NotificationUtilities, SendMessageComposer, WiredSelectionVisualizer } from '../../api';
import { WiredSelectObjectEvent } from '../../events';
import { useMessageEvent, useUiEvent } from '../events';

const useWiredState = () =>
{
    const [ trigger, setTrigger ] = useState<Triggerable>(null);
    const [ intParams, setIntParams ] = useState<number[]>([]);
    const [ stringParam, setStringParam ] = useState<string>('');
    const [ furniIds, setFurniIds ] = useState<number[]>([]);
    const [ actionDelay, setActionDelay ] = useState<number>(0);

    const saveWired = () =>
    {
        const save = (trigger: Triggerable) =>
        {
            if(!trigger) return;

            if(trigger instanceof WiredActionDefinition)
            {
                SendMessageComposer(new UpdateActionMessageComposer(trigger.id, intParams, stringParam, furniIds, actionDelay, trigger.stuffTypeSelectionCode));
            }

            else if(trigger instanceof TriggerDefinition)
            {
                SendMessageComposer(new UpdateTriggerMessageComposer(trigger.id, intParams, stringParam, furniIds, trigger.stuffTypeSelectionCode));
            }

            else if(trigger instanceof ConditionDefinition)
            {
                SendMessageComposer(new UpdateConditionMessageComposer(trigger.id, intParams, stringParam, furniIds, trigger.stuffTypeSelectionCode));
            }
        }

        if(!IsOwnerOfFloorFurniture(trigger.id))
        {
            NotificationUtilities.confirm(LocalizeText('wiredfurni.nonowner.change.confirm.body'), () =>
            {
                save(trigger)
            }, null, null, null, LocalizeText('wiredfurni.nonowner.change.confirm.title'));
        }
        else
        {
            save(trigger);
        }
    }

    useUiEvent<WiredSelectObjectEvent>(WiredSelectObjectEvent.SELECT_OBJECT, event =>
    {
        const furniId = event.objectId;

        if(furniId <= 0) return;

        setFurniIds(prevValue =>
        {
            const newFurniIds = [ ...prevValue ];

            const index = prevValue.indexOf(furniId);

            if(index >= 0)
            {
                newFurniIds.splice(index, 1);

                WiredSelectionVisualizer.hide(furniId);
            }

            else if(newFurniIds.length < trigger.maximumItemSelectionCount)
            {
                newFurniIds.push(furniId);

                WiredSelectionVisualizer.show(furniId);
            }

            return newFurniIds;
        });
    });

    useMessageEvent<WiredFurniActionEvent>(WiredFurniActionEvent, event =>
    {
        const parser = event.getParser();

        setTrigger(parser.definition);
    });

    useMessageEvent<WiredFurniConditionEvent>(WiredFurniConditionEvent, event =>
    {
        const parser = event.getParser();

        setTrigger(parser.definition);
    });

    useMessageEvent<WiredFurniTriggerEvent>(WiredFurniTriggerEvent, event =>
    {
        const parser = event.getParser();

        setTrigger(parser.definition);
    });

    return { trigger, setTrigger, intParams, setIntParams, stringParam, setStringParam, furniIds, setFurniIds, actionDelay, setActionDelay, saveWired };
}

export const useWired = () => useBetween(useWiredState);
