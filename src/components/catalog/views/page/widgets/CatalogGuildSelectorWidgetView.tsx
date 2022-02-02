import { CatalogGroupsComposer, StringDataType } from '@nitrots/nitro-renderer';
import { FC, useEffect, useMemo, useState } from 'react';
import { LocalizeText } from '../../../../../api';
import { Base } from '../../../../../common/Base';
import { Button } from '../../../../../common/Button';
import { Flex } from '../../../../../common/Flex';
import { SendMessageHook } from '../../../../../hooks';
import { useCatalogContext } from '../../../CatalogContext';

export const CatalogGuildSelectorWidgetView: FC<{}> = props =>
{
    const [ selectedGroupIndex, setSelectedGroupIndex ] = useState<number>(0);
    const { currentOffer = null, catalogOptions = null, setPurchaseOptions = null } = useCatalogContext();
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
                const extraParamRequired = true;
                const extraData = ((previewStuffData && previewStuffData.getValue(1)) || null);

                return { ...prevValue, extraParamRequired, extraData, previewStuffData };
            });
    }, [ currentOffer, previewStuffData, setPurchaseOptions ]);

    useEffect(() =>
    {
        SendMessageHook(new CatalogGroupsComposer());
    }, []);

    if(!groups || !groups.length)
    {
        return (
            <Base className="bg-muted rounded p-1 text-black text-center">
                { LocalizeText('catalog.guild_selector.members_only') }
                <Button className="mt-1">
                    { LocalizeText('catalog.guild_selector.find_groups') }
                </Button>
            </Base>
        );
    }

    const selectedGroup = groups[selectedGroupIndex];

    return (
        <Flex gap={ 1 }>
            { !!selectedGroup &&
                <Flex overflow="hidden" className="rounded border">
                    <Base fullHeight style={ { width: '20px', backgroundColor: '#' + selectedGroup.colorA } } />
                    <Base fullHeight style={ { width: '20px', backgroundColor: '#' + selectedGroup.colorB } } />
                </Flex> }
            <select className="form-select form-select-sm" value={ selectedGroupIndex } onChange={ event => setSelectedGroupIndex(parseInt(event.target.value)) }>
                { groups.map((group, index) => <option key={ index } value={ index }>{ group.groupName }</option>) }
            </select>
        </Flex>
    );
}
