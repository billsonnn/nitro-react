import { FC, useCallback, useEffect, useState } from 'react';
import List from 'react-virtualized/dist/commonjs/List';
import { RoomObjectItem } from '../../../../events/room-widgets/choosers/RoomObjectItem';
import { CreateEventDispatcherHook } from '../../../../hooks';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../layout';
import { LocalizeText } from '../../../../utils';
import { useRoomContext } from '../../context/RoomContext';
import { RoomWidgetRoomObjectUpdateEvent } from '../../events';
import { RoomWidgetRequestWidgetMessage, RoomWidgetRoomObjectMessage } from '../../messages';
import { ChooserWidgetViewProps } from './ChooserWidgetView.type';

export const ChooserWidgetView: FC<ChooserWidgetViewProps> = props =>
{
    const [filteredItems, setFilteredItems] = useState<RoomObjectItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<RoomObjectItem>(null);
    const [refreshTimeout, setRefreshTimeout] = useState<ReturnType<typeof setTimeout>>(null);
    const [searchValue, setSearchValue] = useState('');
    const { title = null, onCloseClick = null, displayItemId = false, items = null, messageType = null, roomWidgetRoomObjectUpdateEvents = null } = props;
    const { eventDispatcher = null, widgetHandler = null } = useRoomContext();

    useEffect(() =>
    {
        if (!items) return;

        const filteredGroupItems = items.filter(item =>
        {
            return item.name.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase());
        });

        setFilteredItems(filteredGroupItems);
    }, [items, searchValue, setFilteredItems]);

    const onRoomWidgetRoomObjectUpdateEvent = useCallback((event: RoomWidgetRoomObjectUpdateEvent) =>
    {
        if (!event) return;

        if (refreshTimeout) clearTimeout(refreshTimeout);

        setRefreshTimeout(setTimeout(() =>
        {
            widgetHandler.processWidgetMessage(new RoomWidgetRequestWidgetMessage(messageType));
        }, 100));

    }, [refreshTimeout, messageType, widgetHandler]);

    roomWidgetRoomObjectUpdateEvents.forEach(event => CreateEventDispatcherHook(event, eventDispatcher, onRoomWidgetRoomObjectUpdateEvent));

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
                {filteredItems[index].name}
                {displayItemId && (' - ' + filteredItems[index].id)}
            </div>
        );
    }

    return (
        <NitroCardView>
            <NitroCardHeaderView headerText={title} onCloseClick={onCloseClick}></NitroCardHeaderView>
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
    );
}
