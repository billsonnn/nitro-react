import { FC, useCallback, useMemo, useState } from 'react';
import { AutoSizer, List, ListRowProps, ListRowRenderer } from 'react-virtualized';
import { RoomObjectItem, RoomWidgetRoomObjectMessage } from '../../../../api';
import { LocalizeText } from '../../../../api/utils';
import { Column, Flex, Text } from '../../../../common';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../layout';
import { useRoomContext } from '../../context/RoomContext';

interface ChooserWidgetViewProps
{
    title: string;
    items: RoomObjectItem[];
    displayItemId: boolean;
    onCloseClick: () => void;
}

export const ChooserWidgetView: FC<ChooserWidgetViewProps> = props =>
{
    const { title = null, items = null, displayItemId = false, onCloseClick = null } = props;
    const [ selectedItem, setSelectedItem ] = useState<RoomObjectItem>(null);
    const [ searchValue, setSearchValue ] = useState('');
    const { widgetHandler = null } = useRoomContext();

    const filteredItems = useMemo(() =>
    {
        if(!items) return [];

        if(!searchValue || !searchValue.length) return items;

        const value = searchValue.toLocaleLowerCase();

        return items.filter(item => item.name.toLocaleLowerCase().includes(value));
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
            <Flex key={ props.key } alignItems="center" position="absolute" className={ 'rounded px-1' + ((selectedItem === item) ? ' bg-muted' : '') } pointer style={ props.style } onClick={ event => onItemClick(item) }>
                <Text truncate>{ item.name } { displayItemId && (' - ' + item.id) }</Text>
            </Flex>
        );
    }

    return (
        <NitroCardView className="nitro-chooser-widget">
            <NitroCardHeaderView headerText={ title } onCloseClick={ onCloseClick } />
            <NitroCardContentView overflow="hidden">
                <input type="text" className="form-control form-control-sm" placeholder={ LocalizeText('generic.search') } value={searchValue} onChange={event => setSearchValue(event.target.value)} />
                <Column fullHeight overflow="auto">
                    <AutoSizer defaultWidth={ 0 } defaultHeight={ 0 }>
                        { ({ width, height }) => 
                            {
                                return (<List
                                    width={ width }
                                    height={ height }
                                    rowCount={ filteredItems.length }
                                    rowHeight={ 20 }
                                    rowRenderer={ rowRenderer } />)
                            } }
                    </AutoSizer>
                </Column>
            </NitroCardContentView>
        </NitroCardView>
    );
}
