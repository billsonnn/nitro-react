import { CatalogGroupsComposer, StringDataType } from '@nitrots/nitro-renderer';
import { FC, useEffect, useMemo, useState } from 'react';
import { LocalizeText, SendMessageComposer } from '../../../../../api';
import { Button, Flex } from '../../../../../common';
import { useCatalog } from '../../../../../hooks';

export const CatalogGuildSelectorWidgetView: FC<{}> = props =>
{
    const [ selectedGroupIndex, setSelectedGroupIndex ] = useState<number>(0);
    const { currentOffer = null, catalogOptions = null, setPurchaseOptions = null } = useCatalog();
    const { groups = null } = catalogOptions;

    const previewStuffData = useMemo(() =>
    {
        if(!groups || !groups.length) return null;

        const group = groups[selectedGroupIndex];

        if(!group) return null;

        const stuffData = new StringDataType();

        stuffData.setValue([ '0', group.groupId.toString(), group.badgeCode, group.colorA, group.colorB ]);

        return stuffData;
    }, [ selectedGroupIndex, groups ]);

    useEffect(() =>
    {
        if(!currentOffer) return;

        setPurchaseOptions(prevValue =>
        {
            const newValue = { ...prevValue };

            newValue.extraParamRequired = true;
            newValue.extraData = ((previewStuffData && previewStuffData.getValue(1)) || null);
            newValue.previewStuffData = previewStuffData;

            return newValue;
        });
    }, [ currentOffer, previewStuffData, setPurchaseOptions ]);

    useEffect(() =>
    {
        SendMessageComposer(new CatalogGroupsComposer());
    }, []);

    if(!groups || !groups.length)
    {
        return (
            <div className="bg-muted rounded p-1 text-black text-center">
                { LocalizeText('catalog.guild_selector.members_only') }
                <Button className="mt-1">
                    { LocalizeText('catalog.guild_selector.find_groups') }
                </Button>
            </div>
        );
    }

    const selectedGroup = groups[selectedGroupIndex];

    return (
        <div className="flex gap-1">
            { !!selectedGroup &&
                <Flex className="rounded border" overflow="hidden">
                    <div className="h-full" style={ { width: '20px', backgroundColor: '#' + selectedGroup.colorA } } />
                    <div className="h-full" style={ { width: '20px', backgroundColor: '#' + selectedGroup.colorB } } />
                </Flex> }
            <select className="form-select form-select-sm" value={ selectedGroupIndex } onChange={ event => setSelectedGroupIndex(parseInt(event.target.value)) }>
                { groups.map((group, index) => <option key={ index } value={ index }>{ group.groupName }</option>) }
            </select>
        </div>
    );
};
