import { FC, useState } from 'react';
import { LocalizeText, ReportState, ReportType } from '../../../api';
import { Button, Column, Flex, Text } from '../../../common';
import { useHelp } from '../../../hooks';

export const DescribeReportView: FC<{}> = props =>
{
    const [ message, setMessage ] = useState('');
    const { activeReport = null, setActiveReport = null } = useHelp();

    const submitMessage = () =>
    {
        if(message.length < 15) return;

        setActiveReport(prevValue =>
        {
            const currentStep = ReportState.REPORT_SUMMARY;

            return { ...prevValue, message, currentStep };
        });
    }

    const back = () =>
    {
        setActiveReport(prevValue =>
        {
            return { ...prevValue, currentStep: (prevValue.currentStep - 1) };
        });
    }

    return (
        <>
            <Column gap={ 1 }>
                <Text fontSize={ 4 }>{ LocalizeText('help.emergency.chat_report.subtitle') }</Text>
                <Text>{ LocalizeText('help.cfh.input.text') }</Text>
            </Column>
            <textarea className="form-control h-100" value={ message } onChange={ event => setMessage(event.target.value) } />
            <Flex gap={ 2 } justifyContent="between">
                <Button variant="secondary" disabled={ !(activeReport.reportType === ReportType.BULLY || activeReport.reportType === ReportType.EMERGENCY) } onClick={ back }>
                    { LocalizeText('generic.back') }
                </Button>
                <Button disabled={ (message.length < 15) } onClick={ submitMessage }>
                    { LocalizeText('help.emergency.main.submit.button') }
                </Button>
            </Flex>
        </>
    );
}
