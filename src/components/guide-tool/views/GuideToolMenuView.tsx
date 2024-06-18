import { FC } from 'react';
import { LocalizeText } from '../../../api';
import { Button, Column, Flex, Text } from '../../../common';

interface GuideToolMenuViewProps
{
    isOnDuty: boolean;
    isHandlingGuideRequests: boolean;
    setIsHandlingGuideRequests: (value: boolean) => void;
    isHandlingHelpRequests: boolean;
    setIsHandlingHelpRequests: (value: boolean) => void;
    isHandlingBullyReports: boolean;
    setIsHandlingBullyReports: (value: boolean) => void;
    guidesOnDuty: number;
    helpersOnDuty: number;
    guardiansOnDuty: number;
    processAction: (action: string) => void;
}

export const GuideToolMenuView: FC<GuideToolMenuViewProps> = props =>
{
    const {
        isOnDuty = false,
        isHandlingGuideRequests = false,
        setIsHandlingGuideRequests = null,
        isHandlingHelpRequests = false,
        setIsHandlingHelpRequests = null,
        isHandlingBullyReports = false,
        setIsHandlingBullyReports = null,
        guidesOnDuty = 0,
        helpersOnDuty = 0,
        guardiansOnDuty = 0,
        processAction = null
    } = props;

    return (
        <div className="flex flex-col">
            <Flex alignItems="center" className="bg-muted p-2 rounded" gap={ 2 }>
                <div className={ 'duty-switch' + (isOnDuty ? '' : ' off') } onClick={ event => processAction('toggle_duty') } />
                <Column gap={ 0 }>
                    <Text bold>{ LocalizeText('guide.help.guide.tool.yourstatus') }</Text>
                    <Text>{ LocalizeText(`guide.help.guide.tool.duty.${ (isOnDuty ? 'on' : 'off') }`) }</Text>
                </Column>
            </Flex>
            <div className="flex flex-col gap-1">
                <Text bold>{ LocalizeText('guide.help.guide.tool.tickettypeselection.caption') }</Text>
                <div className="flex items-center gap-1">
                    <input checked={ isHandlingGuideRequests } className="form-check-input" disabled={ isOnDuty } type="checkbox" onChange={ event => setIsHandlingGuideRequests(event.target.checked) } />
                    <Text>{ LocalizeText('guide.help.guide.tool.tickettypeselection.guiderequests') }</Text>
                </div>
                <div className="flex items-center gap-1">
                    <input checked={ isHandlingHelpRequests } className="form-check-input" disabled={ isOnDuty } type="checkbox" onChange={ event => setIsHandlingHelpRequests(event.target.checked) } />
                    <Text>{ LocalizeText('guide.help.guide.tool.tickettypeselection.onlyhelprequests') }</Text>
                </div>
                <div className="flex items-center gap-1">
                    <input checked={ isHandlingBullyReports } className="form-check-input" disabled={ isOnDuty } type="checkbox" onChange={ event => setIsHandlingBullyReports(event.target.checked) } />
                    <Text>{ LocalizeText('guide.help.guide.tool.tickettypeselection.bullyreports') }</Text>
                </div>
            </div>
            <hr className="bg-dark m-0" />
            <div className="flex justify-enter items-center gap-2">
                <div className="info-icon" />
                <div className="flex flex-col gap-1">
                    <div dangerouslySetInnerHTML={ { __html: LocalizeText('guide.help.guide.tool.guidesonduty', [ 'amount' ], [ guidesOnDuty.toString() ]) } } />
                    <div dangerouslySetInnerHTML={ { __html: LocalizeText('guide.help.guide.tool.helpersonduty', [ 'amount' ], [ helpersOnDuty.toString() ]) } } />
                    <div dangerouslySetInnerHTML={ { __html: LocalizeText('guide.help.guide.tool.guardiansonduty', [ 'amount' ], [ guardiansOnDuty.toString() ]) } } />
                </div>
            </div>
            <hr className="bg-dark m-0" />
            <Flex gap={ 2 } justifyContent="between">
                <Button disabled onClick={ event => processAction('forum_link') }>{ LocalizeText('guide.help.guide.tool.forum.link') }</Button>
                <Button disabled>{ LocalizeText('guide.help.guide.tool.skill.link') }</Button>
            </Flex>
        </div>
    );
};
