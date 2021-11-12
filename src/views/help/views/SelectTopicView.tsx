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
        const reportState = Object.assign({}, helpReportState);
        reportState.currentStep = --reportState.currentStep;
        setHelpReportState(reportState);
    }, [helpReportState, setHelpReportState]);

    return (
        <>
            <div className="d-grid col-12 mx-auto justify-content-center">
                <div className="col-12"><h3 className="fw-bold">{LocalizeText('help.emergency.chat_report.subtitle')}</h3></div>
                <div className="text-wrap">{LocalizeText('help.cfh.pick.topic')}</div>
            </div>
            <div className="d-grid gap-2 col-8 mx-auto">
                {(selectedCategory < 0) &&
                    cfhCategories.map((category, index) => 
                    {
                        return <button key={index} className="btn btn-danger" type="button" onClick={() => setSelectedCategory(index)}>{LocalizeText(`help.cfh.reason.${category.name}`)}</button>
                    })
                }
                {(selectedCategory >= 0) &&
                    cfhCategories[selectedCategory].topics.map((topic, index) =>
                    {
                        return <button key={index} className="btn btn-danger" type="button" onClick={() => setSelectedTopic(index)}>{LocalizeText('help.cfh.topic.' + topic.id)}</button>
                    })
                }
            </div>

            <div className="d-flex gap-2 justify-content-between mt-auto">
                <button className="btn btn-secondary mt-2" type="button" onClick={back}>{LocalizeText('generic.back')}</button>
                <button className="btn btn-primary mt-2" type="button" disabled={selectedTopic < 0} onClick={submitTopic}>{LocalizeText('help.emergency.main.submit.button')}</button>
            </div>
            
        </>
    );
}
