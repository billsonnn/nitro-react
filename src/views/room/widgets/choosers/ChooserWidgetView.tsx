import { FC, useCallback, useMemo, useState } from 'react';
import { List, ListRowProps, ListRowRenderer } from 'react-virtualized';
import { RoomObjectItem, RoomWidgetRoomObjectMessage } from '../../../../api';
import { LocalizeText } from '../../../../api/utils';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../layout';
import { useRoomContext } from '../../context/RoomContext';
import { ChooserWidgetViewProps } from './ChooserWidgetView.type';

export const ChooserWidgetView: FC<ChooserWidgetViewProps> = props =>
{
    const { title = null, items = null, displayItemId = false, onCloseClick = null } = props;
    const [ selectedItem, setSelectedItem ] = useState<RoomObjectItem>(null);
    const [ searchValue, setSearchValue ] = useState('');
    const { eventDispatcher = null, widgetHandler = null } = useRoomContext();

    const filteredItems = useMemo(() =>
    {
        if(!items) return [];

        if(!searchValue || !searchValue.length) return items;

        const value = searchValue.toLocaleLowerCase();

        return items.filter(item =>
            {
                return item.name.toLocaleLowerCase().includes(value);
            });
    }, [ items, searchValue ]);

    const onItemClick = useCallback((item: RoomObjectItem) =>
    {
        setSelectedItem(item);
        widgetHandler.processWidgetMessage(new RoomWidgetRoomObjectMessage(RoomWidgetRoomObjectMessage.SELECT_OBJECT, item.id, item.category));
    }, [ widgetHandler, setSelectedItem]);

    const rowRenderer: ListRowRenderer = (props: ListRowProps) =>
    {
        const item = filteredItems[props.index];

        return (
            <div key={ props.key } className={ 'list-item' + ((selectedItem === item) ? ' selected' : '') } style={ props.style } onClick={ () => onItemClick(item) }>
                { item.name } { displayItemId && (' - ' + item.id) }
            </div>
        );
    }

    return (
        <NitroCardView className="nitro-chooser-widget">
            <NitroCardHeaderView headerText={ title } onCloseClick={ onCloseClick } />
            <NitroCardContentView>
                <div className="d-flex mb-1">
                    <div className="d-flex flex-grow-1 me-1">
                        <input type="text" className="form-control form-control-sm" placeholder={ LocalizeText('generic.search') } value={searchValue} onChange={event => setSearchValue(event.target.value)} />
                    </div>
                </div>
                <List
                    width={ 150 }
                    height={ 150 }
                    rowCount={ filteredItems.length }
                    rowHeight={ 20 }
                    rowRenderer={ rowRenderer } />
            </NitroCardContentView>
        </NitroCardView>
    );
}
