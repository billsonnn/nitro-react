import { FC, useCallback, useEffect, useState } from 'react';
import ReactSlider from 'react-slider';
import { LocalizeText } from '../../../../api';
import { WiredFurniType } from '../../common/WiredFurniType';
import { useWiredContext } from '../../context/WiredContext';
import { WiredActionBaseView } from './WiredActionBaseView';

export const WiredActionGiveRewardView: FC<{}> = props =>
{
    const [ limitEnabled, setLimitEnabled ] = useState(false);
    const [ rewardTime, setRewardTime ] = useState(1);
    const [ uniqueRewards, setUniqueRewards ] = useState(false);
    const [ rewardsLimit, setRewardsLimit ] = useState(1);
    const [ limitationInterval, setLimitationInterval ] = useState(1);
    const [ rewards, setRewards ] = useState<{ isBadge: boolean, itemCode: string, probability: number }[]>([]);

    const { trigger = null, setIntParams = null, setStringParam = null } = useWiredContext();

    useEffect(() =>
    {
        setRewardTime(trigger.intData.length > 0 ? trigger.intData[0] : 0);
        setUniqueRewards(trigger.intData.length > 1 ? trigger.intData[1] === 1 : false);
        setRewardsLimit(trigger.intData.length > 2 ? trigger.intData[2] : 0);
        setLimitationInterval(trigger.intData.length > 3 ? trigger.intData[3] : 0);
        setLimitEnabled(trigger.intData.length > 3 ? trigger.intData[3] > 0 : false);

        const readRewards: { isBadge: boolean, itemCode: string, probability: number }[] = [];

        if(trigger.stringData.length > 0 && trigger.stringData.includes(';'))
        {
            const splittedRewards = trigger.stringData.split(';');

            for(const rawReward of splittedRewards)
            {
                const reward = rawReward.split(',');

                if(reward.length !== 3) continue;

                readRewards.push({ isBadge: reward[0] === '0', itemCode: reward[1], probability: Number(reward[2]) });
            }
        }

        if(readRewards.length === 0)
        {
            readRewards.push({ isBadge: false, itemCode: '', probability: null });
        }

        setRewards(readRewards);
    }, [ trigger ]);

    const addReward = useCallback(() =>
    {
        setRewards(rewards => [...rewards, { isBadge: false, itemCode: '', probability: null }]);
    }, [ setRewards ]);

    const removeReward = useCallback((index: number) =>
    {
        const rewardsClone = Array.from(rewards);
        rewardsClone.splice(index, 1);

        setRewards(rewardsClone);
    }, [ rewards, setRewards ]);

    const updateReward = useCallback((index: number, isBadge: boolean, itemCode: string, probability: number) =>
    {
        const rewardsClone = Array.from(rewards);
        const reward = rewardsClone[index];

        if(!reward) return;

        reward.isBadge = isBadge;
        reward.itemCode = itemCode;
        reward.probability = probability;

        setRewards(rewardsClone);
    }, [ rewards, setRewards ]);

    const save = useCallback(() =>
    {       
        let stringRewards = [];

        for(const reward of rewards)
        {
            if(!reward.itemCode) continue;

            const rewardsString = [reward.isBadge ? '0' : '1', reward.itemCode, reward.probability.toString()];
            stringRewards.push(rewardsString.join(','));
        }

        if(stringRewards.length > 0)
        {
            setStringParam(stringRewards.join(';'));
            setIntParams([rewardTime, uniqueRewards ? 1 : 0, rewardsLimit, limitationInterval]);
        }
    }, [ rewardTime, uniqueRewards, rewardsLimit, limitationInterval, rewards, setIntParams, setStringParam ]);

    return (
        <WiredActionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } save={ save }>
            <div className="form-check">
                <input className="form-check-input" type="checkbox" id="limitEnabled" onChange={(e) => setLimitEnabled(e.target.checked)} />
                <label className="form-check-label" htmlFor="uniqueRewards">
                    { LocalizeText('wiredfurni.params.prizelimit', ['amount'], [limitEnabled ? rewardsLimit.toString() : '']) }
                </label>
            </div>
            { !limitEnabled && <div className="bg-muted rounded small text-black p-1 text-center">
                    Reward limit not set. Make sure rewards are badges or non-tradeable items.
                </div> }
            { limitEnabled && 
                <ReactSlider
                    className={ 'nitro-slider' }
                    min={ 1 }
                    max={ 1000 }
                    value={ rewardsLimit }
                    onChange={ event => setRewardsLimit(event) } /> }
            <hr className="my-1 mb-2 bg-dark" />
            <div className="fw-bold">How ofter can a user be rewarded?</div>
            <div className="d-flex">
                <select className="form-select form-select-sm w-100" value={ rewardTime } onChange={ (e) => setRewardTime(Number(e.target.value)) }>
                    <option value="0">Once</option>
                    <option value="3">Once every { limitationInterval } minutes</option>
                    <option value="2">Once every { limitationInterval } hours</option>
                    <option value="1">Once every { limitationInterval } days</option>
                </select>
                { rewardTime > 0 && <input type="number" className="ms-2 form-control form-control-sm" value={ limitationInterval } onChange={ event => setLimitationInterval(Number(event.target.value)) } /> }
            </div>
            <hr className="my-1 mb-2 bg-dark" />
            <div className="form-check">
                <input className="form-check-input" type="checkbox" id="uniqueRewards" checked={ uniqueRewards } onChange={(e) => setUniqueRewards(e.target.checked)} />
                <label className="form-check-label" htmlFor="uniqueRewards">
                    Unique rewards
                </label>
            </div>
            <div className="bg-muted rounded small text-black p-1 text-center">If checked each reward will be given once to each user. This will disable the probabilities option.</div>
            <hr className="my-1 mb-2 bg-dark" />
            <div className="d-flex justify-content-between align-items-center">
                <div className="fw-bold">Rewards</div>
                <div className="btn btn-sm btn-success" onClick={ addReward }><i className="fas fa-plus" /></div>
            </div>
            <table className="table-sm">
                <thead>
                    <tr>
                        <td>Badge?</td>
                        <td>Item Code</td>
                        <td>Probability</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    { rewards && rewards.map((reward, index) =>
                        {
                            return (
                                <tr key={ index }>
                                    <td className="d-flex align-items-center justify-content-center">
                                        <input className="form-check-input" type="checkbox" checked={ reward.isBadge } onChange={(e) => updateReward(index, e.target.checked, reward.itemCode, reward.probability)} />
                                    </td>
                                    <td>
                                        <input type="text" className="form-control form-control-sm" value={ reward.itemCode } onChange={ e => updateReward(index, reward.isBadge, e.target.value, reward.probability) } />
                                    </td>
                                    <td>
                                        <input type="number" className="form-control form-control-sm" value={ reward.probability } onChange={ e => updateReward(index, reward.isBadge, reward.itemCode, Number(e.target.value)) } />
                                    </td>
                                    <td>
                                        { index > 0 && <button className="btn btn-sm btn-danger" onClick={() => removeReward(index) }><i className="fas fa-trash" /></button> }
                                    </td>
                                </tr>
                            )
                        }) }
                </tbody>
            </table>
        </WiredActionBaseView>
    );
}
