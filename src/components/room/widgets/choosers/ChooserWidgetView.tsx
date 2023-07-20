import { FC, useEffect, useMemo, useState } from 'react';
import { GetSessionDataManager, LocalizeText, RoomObjectItem } from '../../../../api';
import { classNames, Flex, InfiniteScroll, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../common';

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

        return items.filter(item => item.name?.toLocaleLowerCase().includes(value));
    }, [ items, searchValue ]);

    useEffect(() =>
    {
        if(!selectedItem) return;

        selectItem(selectedItem);
    }, [ selectedItem, selectItem ]);

    return (
        <NitroCardView className="nitro-chooser-widget" theme="primary-slim">
            <NitroCardHeaderView headerText={ title } onCloseClick={ onClose } />
            <NitroCardContentView overflow="hidden" gap={ 2 }>
                <input type="text" className="form-control form-control-sm" placeholder={ LocalizeText('generic.search') } value={ searchValue } onChange={ event => setSearchValue(event.target.value) } />
                <InfiniteScroll rows={ filteredItems } rowRender={ row =>
                {
                    return (
                        <Flex alignItems="center" className={ classNames('rounded p-1', (selectedItem === row) && 'bg-muted') } pointer onClick={ event => setSelectedItem(row) }>
                            <Text truncate>{ row.name } { canSeeId && (' - ' + row.id) }</Text>
                        </Flex>
                    );
                } } />
            </NitroCardContentView>
        </NitroCardView>
    );
}
