import { ConditionDefinition, Triggerable, TriggerDefinition, UpdateActionMessageComposer, UpdateConditionMessageComposer, UpdateTriggerMessageComposer, WiredActionDefinition } from '@nitrots/nitro-renderer';
import { FC, useState } from 'react';
import { IsOwnerOfFloorFurniture, LocalizeText, NotificationUtilities, SendMessageComposer } from '../../api';
import { GetWiredLayout } from './common/GetWiredLayout';
import { WiredContextProvider } from './WiredContext';
import { WiredMessageHandler } from './WiredMessageHandler';

export const WiredView: FC<{}> = props =>
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

    return (
        <WiredContextProvider value={ { trigger, setTrigger, intParams, setIntParams, stringParam, setStringParam, furniIds, setFurniIds, actionDelay, setActionDelay, saveWired } }>
            <WiredMessageHandler />
            { (trigger !== null) &&
                GetWiredLayout(trigger) }
        </WiredContextProvider>
    );
};
