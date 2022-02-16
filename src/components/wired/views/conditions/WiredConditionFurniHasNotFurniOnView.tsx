import { FC, useCallback, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../api';
import { Column } from '../../../../common/Column';
import { Flex } from '../../../../common/Flex';
import { Text } from '../../../../common/Text';
import { WiredFurniType } from '../../common/WiredFurniType';
import { useWiredContext } from '../../context/WiredContext';
import { WiredConditionBaseView } from './WiredConditionBaseView';

export const WiredConditionFurniHasNotFurniOnView: FC<{}> = props =>
{
    const [ requireAll, setRequireAll ] = useState(-1);
    const { trigger = null, setIntParams = null } = useWiredContext();

    const save = useCallback(() =>
    {
        setIntParams([ requireAll ]);
    }, [ requireAll, setIntParams ]);

    useEffect(() =>
    {
        setRequireAll((trigger.intData.length > 0) ? trigger.intData[0] : 0);
    }, [ trigger ]);
    
    return (
        <WiredConditionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_BY_ID } save={ save }>
            <Column gap={ 1 }>
                <Text bold>{ LocalizeText('wiredfurni.params.not_requireall') }</Text>
                { [0, 1].map(value =>
                    {
                        return (
                            <Flex alignItems="center" gap={ 1 } key={ value }>
                                <input className="form-check-input" type="radio" name="requireAll" id={ `requireAll${ value }` } checked={ (requireAll === value) } onChange={ event => setRequireAll(value) } />
                                <Text>{ LocalizeText(`wiredfurni.params.not_requireall.${ value }`) }</Text>
                            </Flex>
                        )
                    }) }
            </Column>
        </WiredConditionBaseView>
    );
}
