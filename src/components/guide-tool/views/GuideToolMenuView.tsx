import { FC } from 'react';
import { LocalizeText } from '../../../api';
import { Base, Button, Column, Flex, Text } from '../../../common';

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
        <Column>
            <Flex alignItems="center" gap={ 2 } className="bg-muted p-2 rounded">
                <Base className={ 'duty-switch' + (isOnDuty ? '' : ' off') } onClick={ event => processAction('toggle_duty') } />
                <Column gap={ 0 }>
                    <Text bold>{ LocalizeText('guide.help.guide.tool.yourstatus') }</Text>
                    <Text>{ LocalizeText(`guide.help.guide.tool.duty.${ (isOnDuty ? 'on' : 'off') }`) }</Text>
                </Column>
            </Flex>
            <Column gap={ 1 }>
                <Text bold>{ LocalizeText('guide.help.guide.tool.tickettypeselection.caption') }</Text>
                <Flex alignItems="center" gap={ 1 }>
                    <input className="form-check-input" disabled={ isOnDuty } type="checkbox" checked={ isHandlingGuideRequests } onChange={ event => setIsHandlingGuideRequests(event.target.checked) } />
                    <Text>{ LocalizeText('guide.help.guide.tool.tickettypeselection.guiderequests') }</Text>
                </Flex>
                <Flex alignItems="center" gap={ 1 }>
                    <input className="form-check-input" disabled={ isOnDuty } type="checkbox" checked={ isHandlingHelpRequests } onChange={ event => setIsHandlingHelpRequests(event.target.checked) } />
                    <Text>{ LocalizeText('guide.help.guide.tool.tickettypeselection.onlyhelprequests') }</Text>
                </Flex>
                <Flex alignItems="center" gap={ 1 }>
                    <input className="form-check-input" disabled={ isOnDuty } type="checkbox" checked={ isHandlingBullyReports } onChange={ event => setIsHandlingBullyReports(event.target.checked) } />
                    <Text>{ LocalizeText('guide.help.guide.tool.tickettypeselection.bullyreports') }</Text>
                </Flex>
            </Column>
            <hr className="bg-dark m-0" />
            <Flex center gap={ 2 }>
                <Base className="info-icon" />
                <Column gap={ 1 }>
                    <Base dangerouslySetInnerHTML={ { __html: LocalizeText('guide.help.guide.tool.guidesonduty', [ 'amount' ], [ guidesOnDuty.toString() ]) } } />
                    <Base dangerouslySetInnerHTML={ { __html: LocalizeText('guide.help.guide.tool.helpersonduty', [ 'amount' ], [ helpersOnDuty.toString() ]) } } />
                    <Base dangerouslySetInnerHTML={ { __html: LocalizeText('guide.help.guide.tool.guardiansonduty', [ 'amount' ], [ guardiansOnDuty.toString() ]) } } />
                </Column>
            </Flex>
            <hr className="bg-dark m-0" />
            <Flex justifyContent="between" gap={ 2 }>
                <Button disabled onClick={ event => processAction('forum_link') }>{ LocalizeText('guide.help.guide.tool.forum.link') }</Button>
                <Button disabled>{ LocalizeText('guide.help.guide.tool.skill.link') }</Button>
            </Flex>
        </Column>
    );
}
