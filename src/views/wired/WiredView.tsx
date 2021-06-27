import { ConditionDefinition, Nitro, TriggerDefinition, WiredActionDefinition, WiredFurniActionEvent, WiredFurniConditionEvent, WiredFurniTriggerEvent } from 'nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { CreateMessageHook } from '../../hooks/messages';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../layout';
import { LocalizeText } from '../../utils/LocalizeText';
import { WiredActionBaseView } from './views/actions/base/WiredActionBaseView';
import { WiredConditionBaseView } from './views/conditions/base/WiredConditionBaseView';
import { WiredTriggerBaseView } from './views/triggers/base/WiredTriggerBaseView';
import { WiredFurniSelectorViewProps } from './WiredView.types';

export const WiredView: FC<WiredFurniSelectorViewProps> = props =>
{
    const [ wiredDefinition, setWiredDefinition ] = useState<TriggerDefinition | WiredActionDefinition | ConditionDefinition>(null);
    const [ name, setName ] = useState(null);
    const [ description, setDescription ] = useState(null);

    useEffect(() =>
    {
        if(!wiredDefinition) return;

        const itemData = Nitro.instance.sessionDataManager.getFloorItemData(wiredDefinition.spriteId);

        if(!itemData) return;

        setName(itemData.name);
        setDescription(itemData.description);
    }, [ wiredDefinition ]);

    const getWiredType = useCallback(() =>
    {
        if(wiredDefinition instanceof TriggerDefinition)
            return 'trigger';
        else if(wiredDefinition instanceof ConditionDefinition)
            return 'condition';
        else
            return 'action';

    }, [ wiredDefinition ]);

    const getTypeBase = useCallback(() =>
    {
        if(wiredDefinition instanceof TriggerDefinition)
            return <WiredTriggerBaseView />;
        else if(wiredDefinition instanceof ConditionDefinition)
            return <WiredConditionBaseView />;
        else
            return <WiredActionBaseView wiredDefinition={ wiredDefinition } />;

    }, [ wiredDefinition ]);

    const onWiredFurniEvent = useCallback((event: WiredFurniTriggerEvent | WiredFurniConditionEvent | WiredFurniActionEvent) =>
    {
        setWiredDefinition(event.getParser().definition);
    }, [ setWiredDefinition ]);

    CreateMessageHook(WiredFurniTriggerEvent, onWiredFurniEvent);
    CreateMessageHook(WiredFurniConditionEvent, onWiredFurniEvent);
    CreateMessageHook(WiredFurniActionEvent, onWiredFurniEvent);

    if(!wiredDefinition) return null;

    return (
        <NitroCardView className="nitro-wired" simple={ true }>
            <NitroCardHeaderView headerText={ LocalizeText('wiredfurni.title') } onCloseClick={ event => {} } />
            <NitroCardContentView className="text-black">
                <div className="d-flex align-items-center">
                    <i className={ 'me-2 icon icon-wired-' + getWiredType()} />
                    <div className="fw-bold">{ name }</div>
                </div>
                <div>{ description }</div>
                <div>
                    { getTypeBase() }
                </div>
                <div className="d-flex mt-2">
                    <button className="btn btn-success me-2 w-100">{ LocalizeText('wiredfurni.ready') }</button>
                    <button className="btn btn-secondary w-100">{ LocalizeText('cancel') }</button>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    );
};
