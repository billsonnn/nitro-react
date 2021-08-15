import { FurnitureStackHeightComposer, FurnitureStackHeightEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import ReactSlider from 'react-slider';
import { CreateMessageHook, SendMessageHook } from '../../../../../hooks';
import { CreateEventDispatcherHook } from '../../../../../hooks/events';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../../layout';
import { LocalizeText } from '../../../../../utils/LocalizeText';
import { useRoomContext } from '../../../context/RoomContext';
import { RoomWidgetUpdateCustomStackHeightEvent } from '../../../events';

const MAX_HEIGHT: number = 40;

export const FurnitureCustomStackHeightView: FC<{}> = props =>
{
    const [ objectId, setObjectId ] = useState(-1);
    const [ height, setHeight ] = useState(0);
    const [ pendingHeight, setPendingHeight ] = useState(-1);

    const { roomSession = null, eventDispatcher = null } = useRoomContext();

    const close = useCallback(() =>
    {
        setObjectId(-1);
        setHeight(0);
    }, []);

    const updateHeight = useCallback((height: number, fromServer: boolean = false) =>
    {
        if(!height) height = 0;
        
        height = Math.abs(height);

        if(!fromServer) ((height > MAX_HEIGHT) && (height = MAX_HEIGHT));

        setHeight(parseFloat(height.toFixed(2)));

        if(!fromServer) setPendingHeight(height * 100);
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

    const placeAboveStack = useCallback(() =>
    {
        sendUpdate(-100);
    }, [ sendUpdate ]);

    const placeAtFloor = useCallback(() =>
    {
        sendUpdate(0);
    }, [ sendUpdate ]);

    useEffect(() =>
    {
        if((objectId === -1) || (pendingHeight === -1)) return;

        const timeout = setTimeout(() => sendUpdate(~~(pendingHeight)), 10);

        return () => clearTimeout(timeout);
    }, [ objectId, pendingHeight, sendUpdate ]);

    if(objectId === -1) return null;

    return (
        <NitroCardView>
            <NitroCardHeaderView headerText={ LocalizeText('widget.custom.stack.height.title') } onCloseClick={ close } />
            <NitroCardContentView>
                <div className="form-group">
                    <label className="fw-bold text-black">{ LocalizeText('widget.custom.stack.height.text') }</label>
                    <ReactSlider
                        className={ 'nitro-slider' }
                        min={ 0 }
                        max={ MAX_HEIGHT }
                        step={ 0.01 }
                        value={ height }
                        onChange={ event => updateHeight(event) }
                        renderThumb={ (props, state) => <div { ...props }>{ state.valueNow }</div> } />
                </div>
                <div className="form-group">
                    <input type="number" min={ 0 } max={ MAX_HEIGHT } value={ height } onChange={ event => updateHeight(parseFloat(event.target.value)) } />
                </div>
                <div className="form-group">
                    <button type="button" className="btn btn-primary" onClick={ placeAboveStack }>{ LocalizeText('furniture.above.stack') }</button>
                    <button type="button" className="btn btn-primary" onClick={ placeAtFloor }>{ LocalizeText('furniture.floor.level') }</button>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    );
}
