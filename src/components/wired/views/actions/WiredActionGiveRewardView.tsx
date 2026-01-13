import { FC, useEffect, useState } from "react"
import { LocalizeText, WiredFurniType } from "../../../../api"
import { useWired } from "../../../../hooks"
import { WiredRangeView } from "../WiredRangeView"
import { WiredActionBaseView } from "./WiredActionBaseView"

export const WiredActionGiveRewardView: FC<{}> = props =>
{
    const [ limitEnabled, setLimitEnabled ] = useState(false)
    const [ rewardTime, setRewardTime ] = useState(1)
    const [ uniqueRewards, setUniqueRewards ] = useState(false)
    const [ rewardsLimit, setRewardsLimit ] = useState(1)
    const [ limitationInterval, setLimitationInterval ] = useState(1)
    const [ rewards, setRewards ] = useState<{ isBadge: boolean, itemCode: string, probability: number }[]>([])
    const { trigger = null, setIntParams = null, setStringParam = null } = useWired()

    const addReward = () => setRewards(rewards => [ ...rewards, { isBadge: false, itemCode: "", probability: null } ])

    const updateReward = (index: number, isBadge: boolean, itemCode: string, probability: number) =>
    {
        const rewardsClone = Array.from(rewards)
        const reward = rewardsClone[index]

        if(!reward) return

        reward.isBadge = isBadge
        reward.itemCode = itemCode
        reward.probability = probability

        setRewards(rewardsClone)
    }

    const save = () =>
    {       
        let stringRewards = []

        for(const reward of rewards)
        {
            if(!reward.itemCode) continue

            const rewardsString = [ reward.isBadge ? "0" : "1", reward.itemCode, reward.probability.toString() ]
            stringRewards.push(rewardsString.join(","))
        }

        if(stringRewards.length > 0)
        {
            setStringParam(stringRewards.join(";"))
            setIntParams([ rewardTime, uniqueRewards ? 1 : 0, rewardsLimit, limitationInterval ])
        }
    }

    useEffect(() =>
    {
        const readRewards: { isBadge: boolean, itemCode: string, probability: number }[] = []

        if(trigger.stringData.length > 0 && trigger.stringData.includes(";"))
        {
            const splittedRewards = trigger.stringData.split(";")

            for(const rawReward of splittedRewards)
            {
                const reward = rawReward.split(",")

                if(reward.length !== 3) continue

                readRewards.push({ isBadge: reward[0] === "0", itemCode: reward[1], probability: Number(reward[2]) })
            }
        }

        const initialRewardCount = 5
        const defaultReward = { isBadge: false, itemCode: "", probability: null }

        if (readRewards.length < initialRewardCount) {
            const remainingCount = initialRewardCount - readRewards.length
            const defaultRewards = Array.from({ length: remainingCount }, () => ({ ...defaultReward }))

            readRewards.push(...defaultRewards)
        }

        setRewardTime((trigger.intData.length > 0) ? trigger.intData[0] : 0)
        setUniqueRewards((trigger.intData.length > 1) ? (trigger.intData[1] === 1) : false)
        setRewardsLimit((trigger.intData.length > 2) ? trigger.intData[2] : 0)
        setLimitationInterval((trigger.intData.length > 3) ? trigger.intData[3] : 0)
        setLimitEnabled((trigger.intData.length > 3) ? trigger.intData[3] > 0 : false)
        setRewards(readRewards)
    }, [ trigger ])

    return (
        <WiredActionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } hasSpecialInput={ true } save={ save }>
            <div className="flex items-center gap-3">
                <input type="checkbox" id="limitEnabled" onChange={ event => setLimitEnabled(event.target.checked) } />
                <label className="font-volter_bold">{ LocalizeText("wiredfurni.params.prizelimit", [ "amount" ], [ limitEnabled ? rewardsLimit.toString() : "" ]) }</label>
            </div>
            { !limitEnabled &&
                <p className="mt-[7px] pl-[26px] text-[#CB0000]">
                    Reward limit not set. Make sure rewards are badges or non-tradeable items.
                </p> }
            { limitEnabled &&
                <WiredRangeView
                    setState={ setRewardsLimit }
                    state={ rewardsLimit }
                    sliderMin={ 1 }
                    sliderMax={ 1000 }
                /> }
            <div className="my-[7px] h-px w-full bg-[#232323]" />
            <div>
                <p className="font-volter_bold">How often can a user be rewarded?</p>
                <div className="flex flex-wrap">
                    <div className="mb-2 flex justify-between gap-[26px]">
                        <div className="flex gap-2">
                            <input type="radio" id="once" name="rewardTime" value={0} checked={rewardTime === 0} onChange={() => setRewardTime(0)} />
                            <label htmlFor="once">Once</label>
                        </div>
                        <input type="number" className="!h-[13px] w-full border border-black bg-transparent px-px py-0.5 !text-[8px]" value={limitationInterval} onChange={(event) => setLimitationInterval(Number(event.target.value))} />
                    </div>
                    <div className="flex">
                        <div className="flex gap-2">
                            <input type="radio" id="every-3-minutes" name="rewardTime" value={3} checked={rewardTime === 3} onChange={() => setRewardTime(3)} />
                            <label htmlFor="every-3-minutes">{limitationInterval} / n Mins</label>
                        </div>
                        <div className="flex gap-2">
                            <input type="radio" id="every-3-hours" name="rewardTime" value={2} checked={rewardTime === 2} onChange={() => setRewardTime(2)} />
                            <label htmlFor="every-3-hours">{limitationInterval} / n Hours</label>
                        </div>
                        <div className="flex gap-2">
                            <input type="radio" id="every-3-days" name="rewardTime" value={1} checked={rewardTime === 1} onChange={() => setRewardTime(1)} />
                            <label htmlFor="every-3-days">{limitationInterval} / n Days</label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="my-[7px] h-px w-full bg-[#232323]" />
            <div>
                <div className="flex items-center gap-3">
                    <input type="checkbox" id="uniqueRewards" checked={ uniqueRewards } onChange={ (e) => setUniqueRewards(e.target.checked) } />
                    <p className="font-volter_bold">Unique rewards</p>
                </div>
                <p className="mt-1 pl-[26px]">If checked each reward will be given once to each user. This will disable the probabilities option.</p>
            </div>
            <div className="my-[7px] h-px w-full bg-[#232323]" />
            <div>
                <p className="font-volter_bold">Rewards</p>
                <table>
                    <thead>
                        <tr>
                            <th>
                                <p className="!text-[8px]">Badge?</p>
                            </th>
                            <th>
                                <p className="!text-[8px]">Product/Badge Code</p>
                            </th>
                            <th />
                            <th>
                                <p className="!text-[8px]">Probability</p>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        { rewards && rewards.map((reward, index) => {
                            return (
                                <tr key={ index }>
                                    <td>
                                        <input type="checkbox" checked={ reward.isBadge } onChange={ (e) => updateReward(index, e.target.checked, reward.itemCode, reward.probability) } />
                                    </td>
                                    <td className="w-[105px]">
                                        <input type="text" className="w-full" value={ reward.itemCode } onChange={ e => updateReward(index, reward.isBadge, e.target.value, reward.probability) } />
                                    </td>
                                    <td className="min-w-[13px]" />
                                    <td className="max-w-[51px]">
                                        <input type="number" className="w-full" value={ reward.probability } onChange={ e => updateReward(index, reward.isBadge, reward.itemCode, Number(e.target.value)) } />
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </WiredActionBaseView>
    )
}
