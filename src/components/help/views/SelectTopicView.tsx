import { FC, useState } from 'react';
import { LocalizeText, ReportState } from '../../../api';
import { Button, Column, Flex, Text } from '../../../common';
import { useHelp, useModTools } from '../../../hooks';

export const SelectTopicView: FC<{}> = props =>
{
    const [ selectedCategory, setSelectedCategory ] = useState(-1);
    const [ selectedTopic, setSelectedTopic ] = useState(-1);
    const { setActiveReport = null } = useHelp();
    const { cfhCategories = [] } = useModTools();

    const submitTopic = () =>
    {
        if((selectedCategory < 0) || (selectedTopic < 0)) return;

        setActiveReport(prevValue =>
        {
            return { ...prevValue, cfhCategory: selectedCategory, cfhTopic: cfhCategories[selectedCategory].topics[selectedTopic].id, currentStep: ReportState.INPUT_REPORT_MESSAGE };
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
                <Text>{ LocalizeText('help.cfh.pick.topic') }</Text>
            </Column>
            <Column gap={ 1 } overflow="auto">
                { (selectedCategory < 0) &&
                    cfhCategories.map((category, index) => <Button key={ index } variant="danger" onClick={ event => setSelectedCategory(index) }>{ LocalizeText(`help.cfh.reason.${ category.name }`) }</Button>) }
                { (selectedCategory >= 0) &&
                    cfhCategories[selectedCategory].topics.map((topic, index) => <Button key={ index } variant="danger" onClick={ event => setSelectedTopic(index) } active={ (selectedTopic === index) }>{ LocalizeText(`help.cfh.topic.${ topic.id }`) }</Button>) }
            </Column>
            <Flex gap={ 2 } justifyContent="between">
                <Button variant="secondary" onClick={ back }>
                    { LocalizeText('generic.back') }
                </Button>
                <Button disabled={ (selectedTopic < 0) } onClick={ submitTopic }>
                    { LocalizeText('help.emergency.main.submit.button') }
                </Button>
            </Flex>
        </>
    );
}
