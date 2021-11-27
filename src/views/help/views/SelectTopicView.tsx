import { FC, useCallback, useMemo, useState } from 'react';
import { LocalizeText } from '../../../api';
import { GetCfhCategories } from '../../mod-tools/common/GetCFHCategories';
import { useHelpContext } from '../context/HelpContext';

export const SelectTopicView: FC<{}> = props =>
{
    const { helpReportState = null, setHelpReportState = null } = useHelpContext();
    const [selectedCategory, setSelectedCategory] = useState(-1);
    const [selectedTopic, setSelectedTopic] = useState(-1);

    const cfhCategories = useMemo(() =>
    {
        return GetCfhCategories();
    }, []);

    const submitTopic = useCallback(() =>
    {
        if(selectedCategory < 0) return;
        if(selectedTopic < 0) return;

        const reportState = Object.assign({}, helpReportState);
        reportState.cfhCategory = selectedCategory;
        reportState.cfhTopic = cfhCategories[selectedCategory].topics[selectedTopic].id;
        reportState.currentStep = 4;
        setHelpReportState(reportState);
    }, [cfhCategories, helpReportState, selectedCategory, selectedTopic, setHelpReportState]);

    const back = useCallback(() =>
    {
        if(selectedCategory < 0)
        {
            const reportState = Object.assign({}, helpReportState);
            reportState.currentStep = --reportState.currentStep;
            setHelpReportState(reportState);
        }
        else
        {
            setSelectedCategory(-1);
            setSelectedTopic(-1);
        }
        
    }, [ helpReportState, selectedCategory, setHelpReportState ]);

    return (
        <div className="d-flex flex-column gap-2 h-100">
            <h3 className="text-center m-0">{LocalizeText('help.emergency.chat_report.subtitle')}</h3>
            <div className="text-wrap">{LocalizeText('help.cfh.pick.topic')}</div>
            <div className="d-flex flex-column gap-2">
                {(selectedCategory < 0) &&
                    cfhCategories.map((category, index) => 
                    {
                        return <button key={index} className="btn btn-danger" onClick={() => setSelectedCategory(index)}>{LocalizeText(`help.cfh.reason.${category.name}`)}</button>
                    })
                }
                {(selectedCategory >= 0) &&
                    cfhCategories[selectedCategory].topics.map((topic, index) =>
                    {
                        return <button key={index} className="btn btn-danger" onClick={() => setSelectedTopic(index)}>{LocalizeText('help.cfh.topic.' + topic.id)}</button>
                    })
                }
            </div>

            <div className="d-flex gap-2 justify-content-between mt-2">
                <button className="btn btn-primary w-100" onClick={back}>{LocalizeText('generic.back')}</button>
                {(selectedCategory >= 0) && <button className="btn btn-success w-100" disabled={selectedTopic < 0} onClick={submitTopic}>{LocalizeText('help.emergency.main.submit.button')}</button> }
            </div>
            
        </div>
    );
}
