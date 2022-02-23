import { FC, useCallback, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../api';
import { Column } from '../../../../common/Column';
import { Text } from '../../../../common/Text';
import { BatchUpdates } from '../../../../hooks';
import { WiredFurniType } from '../../common/WiredFurniType';
import { useWiredContext } from '../../context/WiredContext';
import { WiredConditionBaseView } from './WiredConditionBaseView';

export const WiredConditionDateRangeView: FC<{}> = props =>
{
    const [ startDate, setStartDate ] = useState('');
    const [ endDate, setEndDate ] = useState('');
    const { trigger = null, setIntParams = null } = useWiredContext();

    const dateToString = useCallback((date: Date) =>
    {
        return `${date.getFullYear()}/${('0' + (date.getMonth() + 1)).slice(-2)}/${('0' + date.getDate()).slice(-2)}${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}`;
    }, []);

    const save = useCallback(() =>
    {
        let startDateMili = 0;
        let endDateMili = 0;

        const startDateInstance = new Date(startDate);
        const endDateInstance = new Date(endDate);

        if(startDateInstance && endDateInstance)
        {
            startDateMili = startDateInstance.getTime() / 1000;
            endDateMili = endDateInstance.getTime() / 1000;
        }

        setIntParams([startDateMili, endDateMili]);
    }, [ startDate, endDate, setIntParams ]);

    useEffect(() =>
    {
        if(trigger.intData.length >= 2)
        {
            let startDate = new Date();
            let endDate = new Date();

            if(trigger.intData[0] > 0) startDate = new Date((trigger.intData[0] * 1000));

            if(trigger.intData[1] > 0) endDate = new Date((trigger.intData[1] * 1000));

            BatchUpdates(() =>
            {
                setStartDate(dateToString(startDate));
                setEndDate(dateToString(endDate));
            });
        }
    }, [ trigger, dateToString ]);
    
    return (
        <WiredConditionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } save={ save }>
            <Column gap={ 1 }>
                <Text bold>{ LocalizeText('wiredfurni.params.startdate') }</Text>
                <input type="text" className="form-control form-control-sm" value={ startDate } onChange={ (e) => setStartDate(e.target.value) } />
            </Column>
            <Column gap={ 1 }>
                <Text bold>{ LocalizeText('wiredfurni.params.enddate') }</Text>
                <input type="text" className="form-control form-control-sm" value={ endDate } onChange={ (e) => setEndDate(e.target.value) } />
            </Column>
        </WiredConditionBaseView>
    );
}
