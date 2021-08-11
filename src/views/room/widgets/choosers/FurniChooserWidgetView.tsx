import { FC, useCallback, useEffect, useState } from 'react';
import List from 'react-virtualized/dist/commonjs/List';
import { RoomObjectItem } from '../../../../events/room-widgets/choosers/RoomObjectItem';
import { RoomWidgetChooserContentEvent } from '../../../../events/room-widgets/choosers/RoomWidgetChooserContentEvent';
import { CreateEventDispatcherHook, useUiEvent } from '../../../../hooks';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../layout';
import { LocalizeText } from '../../../../utils';
import { useRoomContext } from '../../context/RoomContext';
import { RoomWidgetRoomObjectUpdateEvent } from '../../events';
import { RoomWidgetRequestWidgetMessage, RoomWidgetRoomObjectMessage } from '../../messages';

export const FurniChooserWidgetView: FC = props =>
{
    const [isVisible, setIsVisible] = useState(false);
    const [items, setItems] = useState<RoomObjectItem[]>(null);
    const [filteredItems, setFilteredItems] = useState<RoomObjectItem[]>(null);
    const [selectedItem, setSelectedItem] = useState<RoomObjectItem>(null);
    const [refreshTimeout, setRefreshTimeout] = useState<ReturnType<typeof setTimeout>>(null);
    const [searchValue, setSearchValue] = useState('');
    const { eventDispatcher = null, widgetHandler = null } = useRoomContext();

    const onFurniChooserContent = useCallback((event: RoomWidgetChooserContentEvent) =>
    {
        setItems(event.items);
        setIsVisible(true);
    }, []);

    const onRoomWidgetRoomObjectUpdateEvent = useCallback((event: RoomWidgetRoomObjectUpdateEvent) =>
    {
        if (!event || !isVisible) return;

        if (refreshTimeout) clearTimeout(refreshTimeout);

        setRefreshTimeout(setTimeout(() =>
        {
            widgetHandler.processWidgetMessage(new RoomWidgetRequestWidgetMessage(RoomWidgetRequestWidgetMessage.FURNI_CHOOSER));
        }, 100));

    }, [isVisible, refreshTimeout, widgetHandler]);

    useUiEvent(RoomWidgetChooserContentEvent.FURNI_CHOOSER_CONTENT, onFurniChooserContent);
    CreateEventDispatcherHook(RoomWidgetRoomObjectUpdateEvent.FURNI_ADDED, eventDispatcher, onRoomWidgetRoomObjectUpdateEvent);
    CreateEventDispatcherHook(RoomWidgetRoomObjectUpdateEvent.FURNI_REMOVED, eventDispatcher, onRoomWidgetRoomObjectUpdateEvent);

    useEffect(() =>
    {
        if(!items) return;
        
        let filteredGroupItems = [ ...items ];

        if(searchValue && searchValue.length)
        {
            const comparison = searchValue.toLocaleLowerCase();

            filteredGroupItems = items.filter(item =>
                {
                    if(comparison && comparison.length)
                    {
                        if(item.name.toLocaleLowerCase().includes(comparison)) return item;
                    }

                    return null;
                });
        }

        setFilteredItems(filteredGroupItems);
    }, [ items, searchValue, setFilteredItems ]);


    const onClose = useCallback(() =>
    {
        setIsVisible(false);
        setItems(null);
    }, []);

    const onClickItem = useCallback((item: RoomObjectItem) =>
    {
        setSelectedItem(item);
        widgetHandler.processWidgetMessage(new RoomWidgetRoomObjectMessage(RoomWidgetRoomObjectMessage.SELECT_OBJECT, item.id, item.category));
    }, [setSelectedItem, widgetHandler]);

    const rowRenderer = function ({
        key, // Unique key within array of rows
        index, // Index of row within collection
        isScrolling, // The List is currently being scrolled
        isVisible, // This row is visible within the List (eg it is not an overscanned row)
        style, // Style object to be applied to row (to position it)
    })
    {
        return (
            <div key={key} style={style} onClick={() => onClickItem(filteredItems[index])} className={(selectedItem === filteredItems[index] ? 'selected-item ' : '') + 'list-item'}>
                {filteredItems[index].name} - {filteredItems[index].id}
            </div>
        );
    }

    if (!isVisible) return null;

    return (
        <div className="chooser-widget">
            <NitroCardView>
                <NitroCardHeaderView headerText={LocalizeText('widget.chooser.furni.title')} onCloseClick={onClose}></NitroCardHeaderView>
                <NitroCardContentView>
                <div className="d-flex mb-1">
                    <div className="d-flex flex-grow-1 me-1">
                        <input type="text" className="form-control form-control-sm" placeholder={LocalizeText('generic.search')} value={searchValue} onChange={event => setSearchValue(event.target.value)} />
                    </div>
                    </div>
                    <List width={150}
                        height={150}
                        rowCount={filteredItems.length}
                        rowHeight={20}
                        rowRenderer={rowRenderer} />
                </NitroCardContentView>
            </NitroCardView>
        </div>
    )
}
