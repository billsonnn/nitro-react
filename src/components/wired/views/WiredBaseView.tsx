import { FC, useCallback, useEffect, useState } from 'react';
import { GetSessionDataManager, LocalizeText } from '../../../api';
import { Button } from '../../../common/Button';
import { Column } from '../../../common/Column';
import { Flex } from '../../../common/Flex';
import { Text } from '../../../common/Text';
import { WiredEvent } from '../../../events';
import { BatchUpdates } from '../../../hooks';
import { dispatchUiEvent } from '../../../hooks/events';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../layout';
import { WiredFurniType } from '../common/WiredFurniType';
import { WiredSelectionVisualizer } from '../common/WiredSelectionVisualizer';
import { useWiredContext } from '../context/WiredContext';
import { WiredFurniSelectorView } from './WiredFurniSelectorView';

export interface WiredBaseViewProps
{
    wiredType: string;
    requiresFurni: number;
    save: () => void;
    validate?: () => boolean;
}

export const WiredBaseView: FC<WiredBaseViewProps> = props =>
{
    const { wiredType = '', requiresFurni = WiredFurniType.STUFF_SELECTION_OPTION_NONE, save = null, validate = null, children = null } = props;
    const [ wiredName, setWiredName ] = useState<string>(null);
    const [ wiredDescription, setWiredDescription ] = useState<string>(null);
    const { trigger = null, setTrigger = null, setIntParams = null, setStringParam = null, setFurniIds = null } = useWiredContext();

    const onSave = useCallback(() =>
    {
        if(validate && !validate()) return;

        if(save) save();

        setTimeout(() => dispatchUiEvent(new WiredEvent(WiredEvent.SAVE_WIRED)), 1);
    }, [ save, validate ]);

    const close = useCallback(() =>
    {
        setTrigger(null);
    }, [ setTrigger ]);

    useEffect(() =>
    {
        if(!trigger) return;

        const spriteId = (trigger.spriteId || -1);
        const furniData = GetSessionDataManager().getFloorItemData(spriteId);

        BatchUpdates(() =>
        {
            if(!furniData)
            {
                setWiredName(('NAME: ' + spriteId));
                setWiredDescription(('NAME: ' + spriteId));
            }
            else
            {
                setWiredName(furniData.name);
                setWiredDescription(furniData.description);
            }

            setIntParams(trigger.intData);
            setStringParam(trigger.stringData);
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
        });
    }, [ trigger, setIntParams, setStringParam, setFurniIds ]);

    return (
        <NitroCardView uniqueKey="nitro-wired" className="nitro-wired" simple={ true }>
            <NitroCardHeaderView headerText={ LocalizeText('wiredfurni.title') } onCloseClick={ close } />
            <NitroCardContentView>
                <Column gap={ 1 }>
                    <Flex alignItems="center" gap={ 1 }>
                        <i className={ `icon icon-wired-${ wiredType }` } />
                        <Text bold>{ wiredName }</Text>
                    </Flex>
                    <Text small>{ wiredDescription }</Text>
                </Column>
                { !!children && <hr className="m-0 bg-dark" /> }
                { children }
                { (requiresFurni > WiredFurniType.STUFF_SELECTION_OPTION_NONE) &&
                    <>
                        <hr className="m-0 bg-dark" />
                        <WiredFurniSelectorView />
                    </> }
                <Flex alignItems="center" gap={ 1 }>
                    <Button fullWidth variant="success" onClick={ onSave }>{ LocalizeText('wiredfurni.ready') }</Button>
                    <Button fullWidth variant="secondary" onClick={ close }>{ LocalizeText('cancel') }</Button>
                </Flex>
            </NitroCardContentView>
        </NitroCardView>
    );
}
