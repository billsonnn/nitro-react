import { CancelMysteryBoxWaitMessageEvent, GetSessionDataManager, GotMysteryBoxPrizeMessageEvent, MysteryBoxWaitingCanceledMessageComposer, ShowMysteryBoxWaitMessageEvent } from '@nitrots/nitro-renderer';
import { FC, useState } from 'react';
import { LocalizeText, SendMessageComposer } from '../../../../api';
import { Button, Flex, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../common';
import { LayoutPrizeProductImageView } from '../../../../common/layout/LayoutPrizeProductImageView';
import { useMessageEvent } from '../../../../hooks';

interface FurnitureMysteryBoxOpenDialogViewProps
{
    ownerId: number;
}

type PrizeData = {
    contentType:string;
    classId:number;
}

enum ViewMode {
    HIDDEN,
    WAITING,
    PRIZE
}

export const FurnitureMysteryBoxOpenDialogView: FC<FurnitureMysteryBoxOpenDialogViewProps> = props =>
{
    const { ownerId = -1 } = props;
    const [ mode, setMode ] = useState<ViewMode>(ViewMode.HIDDEN);
    const [ prizeData, setPrizeData ] = useState<PrizeData>(undefined);

    const close = () =>
    {
        if(mode === ViewMode.WAITING) SendMessageComposer(new MysteryBoxWaitingCanceledMessageComposer(ownerId));
        setMode(ViewMode.HIDDEN);
        setPrizeData(undefined);
    }

    useMessageEvent<ShowMysteryBoxWaitMessageEvent>(ShowMysteryBoxWaitMessageEvent, event =>
    {
        setMode(ViewMode.WAITING);
    });

    useMessageEvent<CancelMysteryBoxWaitMessageEvent>(CancelMysteryBoxWaitMessageEvent, event =>
    {
        setMode(ViewMode.HIDDEN);
        setPrizeData(undefined);
    });

    useMessageEvent<GotMysteryBoxPrizeMessageEvent>(GotMysteryBoxPrizeMessageEvent, event =>
    {
        const parser = event.getParser();
        setPrizeData({ contentType: parser.contentType, classId: parser.classId });
        setMode(ViewMode.PRIZE);
    });

    const isOwner = GetSessionDataManager().userId === ownerId;

    if(mode === ViewMode.HIDDEN) return null;

    return (
        <NitroCardView className="nitro-mysterybox-dialog" theme="primary-slim">
            <NitroCardHeaderView headerText={ mode === ViewMode.WAITING ? LocalizeText(`mysterybox.dialog.${ isOwner ? 'owner' : 'other' }.title`) : LocalizeText('mysterybox.reward.title') } onCloseClick={ close } />
            <NitroCardContentView>
                { mode === ViewMode.WAITING && <>
                    <Text variant="primary"> { LocalizeText(`mysterybox.dialog.${ isOwner ? 'owner' : 'other' }.subtitle`) } </Text>
                    <Text> { LocalizeText(`mysterybox.dialog.${ isOwner ? 'owner' : 'other' }.description`) } </Text>
                    <Text> { LocalizeText(`mysterybox.dialog.${ isOwner ? 'owner' : 'other' }.waiting`) }</Text>
                    <Button variant="danger" onClick={ close } className="mt-auto"> { LocalizeText(`mysterybox.dialog.${ isOwner ? 'owner' : 'other' }.cancel`) } </Button>
                </>
                }
                { mode === ViewMode.PRIZE && prizeData && <>
                    <Text variant="black"> { LocalizeText('mysterybox.reward.text') } </Text>
                    <Flex className="prize-container justify-content-center mx-auto">
                        <LayoutPrizeProductImageView classId={ prizeData.classId } productType={ prizeData.contentType }/>
                    </Flex>
                    <Button variant="success" onClick={ close } className="mt-auto"> { LocalizeText('mysterybox.reward.close') } </Button>
                </>
                }
            </NitroCardContentView>
        </NitroCardView>
    );
}
