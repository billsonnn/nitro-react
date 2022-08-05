import { FC, useEffect, useMemo, useState } from 'react';
import { AutoSizer, List, ListRowProps, ListRowRenderer } from 'react-virtualized';
import { GetSessionDataManager, LocalizeText, RoomObjectItem } from '../../../../api';
import { Column, Flex, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../common';

interface ChooserWidgetViewProps
{
    title: string;
    items: RoomObjectItem[];
    selectItem: (item: RoomObjectItem) => void;
    onClose: () => void;
}

export const ChooserWidgetView: FC<ChooserWidgetViewProps> = props =>
{
    const { title = null, items = [], selectItem = null, onClose = null } = props;
    const [ selectedItem, setSelectedItem ] = useState<RoomObjectItem>(null);
    const [ searchValue, setSearchValue ] = useState('');
    const canSeeId = GetSessionDataManager().isModerator;

    const filteredItems = useMemo(() =>
    {
        const value = searchValue.toLocaleLowerCase();

        return items.filter(item => item.name.toLocaleLowerCase().includes(value));
    }, [ items, searchValue ]);

    const rowRenderer: ListRowRenderer = (props: ListRowProps) =>
    {
        const item = filteredItems[props.index];

        return (
            <Flex key={ props.key } alignItems="center" position="absolute" className={ 'rounded px-1' + ((selectedItem === item) ? ' bg-muted' : '') } pointer style={ props.style } onClick={ event => setSelectedItem(item) }>
                <Text truncate>{ item.name } { canSeeId && (' - ' + item.id) }</Text>
            </Flex>
        );
    }

    useEffect(() =>
    {
        if(!selectedItem) return;

        selectItem(selectedItem);
    }, [ selectedItem, selectItem ]);

    return (
        <NitroCardView className="nitro-chooser-widget" theme="primary-slim">
            <NitroCardHeaderView headerText={ title } onCloseClick={ onClose } />
            <NitroCardContentView overflow="hidden">
                <input type="text" className="form-control form-control-sm" placeholder={ LocalizeText('generic.search') } value={ searchValue } onChange={ event => setSearchValue(event.target.value) } />
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
