import { FurnitureStackHeightComposer, FurnitureStackHeightEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import ReactSlider from 'react-slider';
import { LocalizeText, RoomWidgetUpdateCustomStackHeightEvent } from '../../../../../api';
import { BatchUpdates, CreateMessageHook, SendMessageHook } from '../../../../../hooks';
import { CreateEventDispatcherHook } from '../../../../../hooks/events';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView, NitroLayoutButton, NitroLayoutFlex, NitroLayoutFlexColumn, NitroLayoutGrid, NitroLayoutGridColumn } from '../../../../../layout';
import { NitroLayoutBase } from '../../../../../layout/base';
import { useRoomContext } from '../../../context/RoomContext';

const MAX_HEIGHT: number = 40;

export const FurnitureCustomStackHeightView: FC<{}> = props =>
{
    const [ objectId, setObjectId ] = useState(-1);
    const [ height, setHeight ] = useState(0);
    const [ pendingHeight, setPendingHeight ] = useState(-1);
    const { eventDispatcher = null } = useRoomContext();

    const close = useCallback(() =>
    {
        BatchUpdates(() =>
        {
            setObjectId(-1);
            setHeight(0);
        });
    }, []);

    const updateHeight = useCallback((height: number, fromServer: boolean = false) =>
    {
        if(!height) height = 0;
        
        height = Math.abs(height);

        if(!fromServer) ((height > MAX_HEIGHT) && (height = MAX_HEIGHT));

        BatchUpdates(() =>
        {
            setHeight(parseFloat(height.toFixed(2)));

            if(!fromServer) setPendingHeight(height * 100);
        });
    }, []);

    const onRoomWidgetUpdateCustomStackHeightEvent = useCallback((event: RoomWidgetUpdateCustomStackHeightEvent) =>
    {
        switch(event.type)
        {
            case RoomWidgetUpdateCustomStackHeightEvent.UPDATE_CUSTOM_STACK_HEIGHT: {
                setObjectId(event.objectId);
                updateHeight(event.height, true);
            }
        }
    }, [ updateHeight ]);

    CreateEventDispatcherHook(RoomWidgetUpdateCustomStackHeightEvent.UPDATE_CUSTOM_STACK_HEIGHT, eventDispatcher, onRoomWidgetUpdateCustomStackHeightEvent);

    const onFurnitureStackHeightEvent = useCallback((event: FurnitureStackHeightEvent) =>
    {
        const parser = event.getParser();

        if(objectId !== parser.furniId) return;

        updateHeight(parser.height, true);
    }, [ objectId, updateHeight ]);

    CreateMessageHook(FurnitureStackHeightEvent, onFurnitureStackHeightEvent);

    const sendUpdate = useCallback((height: number) =>
    {
        SendMessageHook(new FurnitureStackHeightComposer(objectId, ~~(height)));
    }, [ objectId ]);

    useEffect(() =>
    {
        if((objectId === -1) || (pendingHeight === -1)) return;

        const timeout = setTimeout(() => sendUpdate(~~(pendingHeight)), 10);

        return () => clearTimeout(timeout);
    }, [ objectId, pendingHeight, sendUpdate ]);

    if(objectId === -1) return null;

    return (
        <NitroCardView className="nitro-widget-custom-stack-height" simple={ true }>
            <NitroCardHeaderView headerText={ LocalizeText('widget.custom.stack.height.title') } onCloseClick={ close } />
            <NitroCardContentView>
                <NitroLayoutGrid>
                    <NitroLayoutGridColumn className="justify-content-between" size={ 12 }>
                        <NitroLayoutBase className="text-black" overflow="auto">
                            { LocalizeText('widget.custom.stack.height.text') }
                        </NitroLayoutBase>
                        <NitroLayoutFlexColumn gap={ 2 }>
                            <NitroLayoutFlex gap={ 2 }>
                                <ReactSlider
                                    className="nitro-slider"
                                    min={ 0 }
                                    max={ MAX_HEIGHT }
                                    step={ 0.01 }
                                    value={ height }
                                    onChange={ event => updateHeight(event) }
                                    renderThumb={ (props, state) => <div { ...props }>{ state.valueNow }</div> } />
                                <input type="number" min={ 0 } max={ MAX_HEIGHT } value={ height } onChange={ event => updateHeight(parseFloat(event.target.value)) } />
                            </NitroLayoutFlex>
                            <NitroLayoutButton variant="primary" onClick={ event => sendUpdate(-100) }>
                                { LocalizeText('furniture.above.stack') }
                            </NitroLayoutButton>
                            <NitroLayoutButton variant="primary" onClick={ event => sendUpdate(0) }>
                                { LocalizeText('furniture.floor.level') }
                            </NitroLayoutButton>
                        </NitroLayoutFlexColumn>
                    </NitroLayoutGridColumn>
                </NitroLayoutGrid>
            </NitroCardContentView>
        </NitroCardView>
    );
}
