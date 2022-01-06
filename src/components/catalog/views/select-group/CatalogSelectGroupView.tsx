import { Dispatch, FC, SetStateAction } from 'react';
import { LocalizeText } from '../../../../api';
import { Base } from '../../../../common/Base';
import { Button } from '../../../../common/Button';
import { Flex } from '../../../../common/Flex';
import { Text } from '../../../../common/Text';
import { useCatalogContext } from '../../context/CatalogContext';

export interface CatalogSelectGroupViewProps
{
    selectedGroupIndex: number;
    setSelectedGroupIndex: Dispatch<SetStateAction<number>>;
}

export const CatalogSelectGroupView: FC<CatalogSelectGroupViewProps> = props =>
{
    const { selectedGroupIndex = -1, setSelectedGroupIndex = null } = props;
    const { catalogState = null } = useCatalogContext();
    const { groups = null } = catalogState;

    if(!groups || !groups.length)
    {
        return (
            <Text grow center className="bg-muted rounded p-1">
                { LocalizeText('catalog.guild_selector.members_only') }
                <Button variant="primary" size="sm" className="mt-1">
                    { LocalizeText('catalog.guild_selector.find_groups') }
                </Button>
            </Text>
        );
    }

    return (
        <Flex gap={ 1 }>
            <Flex overflow="hidden" className="rounded border">
                <Base fullHeight style={ { width: '20px', backgroundColor: '#' + groups[selectedGroupIndex].colorA } } />
                <Base fullHeight style={ { width: '20px', backgroundColor: '#' + groups[selectedGroupIndex].colorB } } />
            </Flex>
            <select className="form-select form-select-sm" value={ selectedGroupIndex } onChange={ event => setSelectedGroupIndex(parseInt(event.target.value)) }>
                { groups.map((group, index) => <option key={ index } value={ index }>{ group.groupName }</option>) }
            </select>
        </Flex>
    );
}
