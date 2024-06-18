import { GetSessionDataManager } from '@nitrots/nitro-renderer';
import { FC, useEffect, useMemo, useState } from 'react';
import { LocalizeText, RoomObjectItem } from '../../../../api';
import { Flex, InfiniteScroll, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../common';
import { NitroInput, classNames } from '../../../../layout';

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
            <NitroCardContentView gap={ 2 } overflow="hidden">
                <NitroInput placeholder={ LocalizeText('generic.search') } type="text" value={ searchValue } onChange={ event => setSearchValue(event.target.value) } />
                <InfiniteScroll rowRender={ row =>
                {
                    return (
                        <Flex pointer alignItems="center" className={ classNames('rounded p-1', (selectedItem === row) && 'bg-muted') } onClick={ event => setSelectedItem(row) }>
                            <Text truncate>{ row.name } { canSeeId && (' - ' + row.id) }</Text>
                        </Flex>
                    );
                } } rows={ filteredItems } />
            </NitroCardContentView>
        </NitroCardView>
    );
};
