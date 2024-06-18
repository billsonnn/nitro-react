import { FC, useEffect, useState } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import ReactSlider from 'react-slider';
import { LocalizeText, WiredFurniType } from '../../../../api';
import { Button, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { NitroInput } from '../../../../layout';
import { WiredActionBaseView } from './WiredActionBaseView';

export const WiredActionGiveRewardView: FC<{}> = props =>
{
    const [ limitEnabled, setLimitEnabled ] = useState(false);
    const [ rewardTime, setRewardTime ] = useState(1);
    const [ uniqueRewards, setUniqueRewards ] = useState(false);
    const [ rewardsLimit, setRewardsLimit ] = useState(1);
    const [ limitationInterval, setLimitationInterval ] = useState(1);
    const [ rewards, setRewards ] = useState<{ isBadge: boolean, itemCode: string, probability: number }[]>([]);
    const { trigger = null, setIntParams = null, setStringParam = null } = useWired();

    const addReward = () => setRewards(rewards => [ ...rewards, { isBadge: false, itemCode: '', probability: null } ]);

    const removeReward = (index: number) =>
    {
        setRewards(prevValue =>
        {
            const newValues = Array.from(prevValue);

            newValues.splice(index, 1);

            return newValues;
        });
    };

    const updateReward = (index: number, isBadge: boolean, itemCode: string, probability: number) =>
    {
        const rewardsClone = Array.from(rewards);
        const reward = rewardsClone[index];

        if(!reward) return;

        reward.isBadge = isBadge;
        reward.itemCode = itemCode;
        reward.probability = probability;

        setRewards(rewardsClone);
    };

    const save = () =>
    {
        let stringRewards = [];

        for(const reward of rewards)
        {
            if(!reward.itemCode) continue;

            const rewardsString = [ reward.isBadge ? '0' : '1', reward.itemCode, reward.probability.toString() ];
            stringRewards.push(rewardsString.join(','));
        }

        if(stringRewards.length > 0)
        {
            setStringParam(stringRewards.join(';'));
            setIntParams([ rewardTime, uniqueRewards ? 1 : 0, rewardsLimit, limitationInterval ]);
        }
    };

    useEffect(() =>
    {
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

        if(readRewards.length === 0) readRewards.push({ isBadge: false, itemCode: '', probability: null });

        setRewardTime((trigger.intData.length > 0) ? trigger.intData[0] : 0);
        setUniqueRewards((trigger.intData.length > 1) ? (trigger.intData[1] === 1) : false);
        setRewardsLimit((trigger.intData.length > 2) ? trigger.intData[2] : 0);
        setLimitationInterval((trigger.intData.length > 3) ? trigger.intData[3] : 0);
        setLimitEnabled((trigger.intData.length > 3) ? trigger.intData[3] > 0 : false);
        setRewards(readRewards);
    }, [ trigger ]);

    return (
        <WiredActionBaseView hasSpecialInput={ true } requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } save={ save }>
            <div className="flex items-center gap-1">
                <input className="form-check-input" id="limitEnabled" type="checkbox" onChange={ event => setLimitEnabled(event.target.checked) } />
                <Text>{ LocalizeText('wiredfurni.params.prizelimit', [ 'amount' ], [ limitEnabled ? rewardsLimit.toString() : '' ]) }</Text>
            </div>
            { !limitEnabled &&
                <Text center small className="p-1 rounded bg-muted">
                    Reward limit not set. Make sure rewards are badges or non-tradeable items.
                </Text> }
            { limitEnabled &&
                <ReactSlider
                    className={ 'nitro-slider' }
                    max={ 1000 }
                    min={ 1 }
                    value={ rewardsLimit }
                    onChange={ event => setRewardsLimit(event) } /> }
            <hr className="m-0 bg-dark" />
            <div className="flex flex-col gap-1">
                <Text bold>How often can a user be rewarded?</Text>
                <div className="flex gap-1">
                    <select className="w-full form-select form-select-sm" value={ rewardTime } onChange={ (e) => setRewardTime(Number(e.target.value)) }>
                        <option value="0">Once</option>
                        <option value="3">Once every { limitationInterval } minutes</option>
                        <option value="2">Once every { limitationInterval } hours</option>
                        <option value="1">Once every { limitationInterval } days</option>
                    </select>
                    { (rewardTime > 0) && <NitroInput type="number" value={ limitationInterval } onChange={ event => setLimitationInterval(Number(event.target.value)) } /> }
                </div>
            </div>
            <hr className="m-0 bg-dark" />
            <div className="flex items-center gap-1">
                <input checked={ uniqueRewards } className="form-check-input" id="uniqueRewards" type="checkbox" onChange={ (e) => setUniqueRewards(e.target.checked) } />
                <Text>Unique rewards</Text>
            </div>
            <Text center small className="p-1 rounded bg-muted">
                If checked each reward will be given once to each user. This will disable the probabilities option.
            </Text>
            <hr className="m-0 bg-dark" />
            <div className="flex items-center justify-between">
                <Text bold>Rewards</Text>
                <Button variant="success" onClick={ addReward }>
                    <FaPlus className="fa-icon" />
                </Button>
            </div>
            <div className="flex flex-col gap-1">
                { rewards && rewards.map((reward, index) =>
                {
                    return (
                        <div key={ index } className="flex gap-1">
                            <div className="flex items-center gap-1">
                                <input checked={ reward.isBadge } className="form-check-input" type="checkbox" onChange={ (e) => updateReward(index, e.target.checked, reward.itemCode, reward.probability) } />
                                <Text small>Badge?</Text>
                            </div>
                            <NitroInput placeholder="Item Code" type="text" value={ reward.itemCode } onChange={ e => updateReward(index, reward.isBadge, e.target.value, reward.probability) } />
                            <NitroInput placeholder="Probability" type="number" value={ reward.probability } onChange={ e => updateReward(index, reward.isBadge, reward.itemCode, Number(e.target.value)) } />
                            { (index > 0) &&
                                <Button variant="danger" onClick={ event => removeReward(index) }>
                                    <FaTrash className="fa-icon" />
                                </Button> }
                        </div>
                    );
                }) }
            </div>
        </WiredActionBaseView>
    );
};
