import { FC, useEffect, useState } from 'react';
import { LocalizeText, WiredDateToString, WiredFurniType } from '../../../../api';
import { Column, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredConditionBaseView } from './WiredConditionBaseView';

export const WiredConditionDateRangeView: FC<{}> = props =>
{
    const [ startDate, setStartDate ] = useState('');
    const [ endDate, setEndDate ] = useState('');
    const { trigger = null, setIntParams = null } = useWired();

    const save = () =>
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

        setIntParams([ startDateMili, endDateMili ]);
    }

    useEffect(() =>
    {
        if(trigger.intData.length >= 2)
        {
            let startDate = new Date();
            let endDate = new Date();

            if(trigger.intData[0] > 0) startDate = new Date((trigger.intData[0] * 1000));

            if(trigger.intData[1] > 0) endDate = new Date((trigger.intData[1] * 1000));

            setStartDate(WiredDateToString(startDate));
            setEndDate(WiredDateToString(endDate));
        }
    }, [ trigger ]);
    
    return (
        <WiredConditionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } hasSpecialInput={ true } save={ save }>
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
