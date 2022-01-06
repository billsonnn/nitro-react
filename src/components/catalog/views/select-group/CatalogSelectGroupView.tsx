import { FC } from 'react';
import { LocalizeText } from '../../../../api';
import { NitroLayoutButton, NitroLayoutFlex } from '../../../../layout';
import { NitroLayoutBase } from '../../../../layout/base';
import { useCatalogContext } from '../../context/CatalogContext';
import { CatalogSelectGroupViewProps } from './CatalogSelectGroupView.types';

export const CatalogSelectGroupView: FC<CatalogSelectGroupViewProps> = props =>
{
    const { selectedGroupIndex = -1, setSelectedGroupIndex = null } = props;
    const { catalogState = null } = useCatalogContext();
    const { groups = null } = catalogState;

    if(!groups || !groups.length)
    {
        return (
            <NitroLayoutBase className="flex-grow-1 bg-muted rounded text-black text-center p-1">
                { LocalizeText('catalog.guild_selector.members_only') }
                <NitroLayoutButton className="mt-1" variant="primary" size="sm">
                    { LocalizeText('catalog.guild_selector.find_groups') }
                </NitroLayoutButton>
            </NitroLayoutBase>
        );
    }

    return (
        <NitroLayoutFlex>
            <NitroLayoutFlex className="rounded border me-1" overflow="hidden">
                <NitroLayoutBase className="h-100" style={ { width: '20px', backgroundColor: '#' + groups[selectedGroupIndex].colorA } } />
                <NitroLayoutBase className="h-100" style={ { width: '20px', backgroundColor: '#' + groups[selectedGroupIndex].colorB } } />
            </NitroLayoutFlex>
            <select className="form-select form-select-sm" value={ selectedGroupIndex } onChange={ event => setSelectedGroupIndex(parseInt(event.target.value)) }>
                { groups.map((group, index) =>
                    {
                        return <option key={ index } value={ index }>{ group.groupName }</option>;
                    }) }
            </select>
        </NitroLayoutFlex>
    );
}
