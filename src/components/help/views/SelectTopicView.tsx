import { FC, useMemo, useState } from 'react';
import { LocalizeText } from '../../../api';
import { Button, Column, Flex, Text } from '../../../common';
import { GetCfhCategories } from '../../mod-tools/common/GetCFHCategories';
import { useHelpContext } from '../HelpContext';

export const SelectTopicView: FC<{}> = props =>
{
    const { setHelpReportState = null } = useHelpContext();
    const [ selectedCategory, setSelectedCategory ] = useState(-1);
    const [ selectedTopic, setSelectedTopic ] = useState(-1);

    const cfhCategories = useMemo(() => GetCfhCategories(), []);

    const submitTopic = () =>
    {
        if((selectedCategory < 0) || (selectedTopic < 0)) return;

        setHelpReportState(prevValue =>
            {
                const cfhCategory = selectedCategory;
                const cfhTopic = cfhCategories[selectedCategory].topics[selectedTopic].id;
                const currentStep = 4;

                return { ...prevValue, cfhCategory, cfhTopic, currentStep };
            });
    }

    const back = () =>
    {
        setHelpReportState(prevValue =>
            {
                const currentStep = (prevValue.currentStep - 1);

                return { ...prevValue, currentStep };
            });
    }

    return (
        <>
            <Column gap={ 1 }>
                <Text fontSize={ 3 }>{ LocalizeText('help.emergency.chat_report.subtitle') }</Text>
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
