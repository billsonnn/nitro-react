import { FC, useCallback, useEffect } from 'react';
import { LocalizeText } from '../../../api';
import { WiredSelectObjectEvent } from '../../../events';
import { useUiEvent } from '../../../hooks/events';
import { WiredSelectionVisualizer } from '../common/WiredSelectionVisualizer';
import { useWiredContext } from '../context/WiredContext';

export const WiredFurniSelectorView: FC<{}> = props =>
{
    const { trigger = null, furniIds = [], setFurniIds = null } = useWiredContext();

    const onWiredSelectObjectEvent = useCallback((event: WiredSelectObjectEvent) =>
    {
        const furniId = event.objectId;

        if(furniId === -1) return;

        let newFurniIds: number[] = null;

        setFurniIds(prevValue =>
            {
                newFurniIds = [ ...prevValue ];

                const index = prevValue.indexOf(furniId);

                if(index >= 0)
                {
                    newFurniIds.splice(index, 1);

                    WiredSelectionVisualizer.hide(furniId);
                }
                else
                {
                    if(newFurniIds.length < trigger.maximumItemSelectionCount)
                    {
                        newFurniIds.push(furniId);

                        WiredSelectionVisualizer.show(furniId);
                    }
                }

                return newFurniIds;
            });
    }, [ trigger, setFurniIds ]);

    useUiEvent(WiredSelectObjectEvent.SELECT_OBJECT, onWiredSelectObjectEvent);

    useEffect(() =>
    {
        if(!trigger) return;

        setFurniIds(prevValue =>
            {
                if(prevValue && prevValue.length) WiredSelectionVisualizer.clearSelectionShaderFromFurni(prevValue);

                if(trigger.selectedItems && trigger.selectedItems.length)
                {
                    WiredSelectionVisualizer.applySelectionShaderToFurni(trigger.selectedItems);

                    return trigger.selectedItems;
                }

                return [];
            });

        return () =>
        {
            setFurniIds(prevValue =>
                {
                    WiredSelectionVisualizer.clearSelectionShaderFromFurni(prevValue);

                    return [];
                });
        }
    }, [ trigger, setFurniIds ]);
    
    return (
        <div className="d-flex flex-column">
            <div className="fw-bold">{ LocalizeText('wiredfurni.pickfurnis.caption', ['count', 'limit'], [ furniIds.length.toString(), trigger.maximumItemSelectionCount.toString() ]) }</div>
            { LocalizeText('wiredfurni.pickfurnis.desc') }
        </div>
    );
}
