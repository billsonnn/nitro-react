import { FC, useCallback } from 'react';
import { LocalizeText, WiredSelectionVisualizer } from '../../../api';
import { Column, Text } from '../../../common';
import { WiredSelectObjectEvent } from '../../../events';
import { UseUiEvent } from '../../../hooks';
import { useWiredContext } from '../WiredContext';

export const WiredFurniSelectorView: FC<{}> = props =>
{
    const { trigger = null, furniIds = [], setFurniIds = null } = useWiredContext();

    const onWiredSelectObjectEvent = useCallback((event: WiredSelectObjectEvent) =>
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
    }, [ trigger, setFurniIds ]);

    UseUiEvent(WiredSelectObjectEvent.SELECT_OBJECT, onWiredSelectObjectEvent);
    
    return (
        <Column gap={ 1 }>
            <Text bold>{ LocalizeText('wiredfurni.pickfurnis.caption', [ 'count', 'limit' ], [ furniIds.length.toString(), trigger.maximumItemSelectionCount.toString() ]) }</Text>
            <Text small>{ LocalizeText('wiredfurni.pickfurnis.desc') }</Text>
        </Column>
    );
}
