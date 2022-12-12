import { CancelMysteryBoxWaitMessageEvent, GotMysteryBoxPrizeMessageEvent, MysteryBoxWaitingCanceledMessageComposer, ShowMysteryBoxWaitMessageEvent } from '@nitrots/nitro-renderer';
import { FC, useState } from 'react';
import { GetSessionDataManager, LocalizeText, SendMessageComposer } from '../../../../api';
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

export const FurnitureMysteryBoxOpenDialogView: FC<FurnitureMysteryBoxOpenDialogViewProps> = props =>
{
    const { ownerId = -1 } = props;
    const [ mode, setMode ] = useState<'hidden' | 'waiting' | 'prize'>('hidden');
    const [ prizeData, setPrizeData ] = useState<PrizeData>(undefined);

    const close = () =>
    {
        if(mode === 'waiting') SendMessageComposer(new MysteryBoxWaitingCanceledMessageComposer(ownerId));
        setMode('hidden');
        setPrizeData(undefined);
    }

    useMessageEvent<ShowMysteryBoxWaitMessageEvent>(ShowMysteryBoxWaitMessageEvent, event =>
    {
        setMode('waiting');
    });

    useMessageEvent<CancelMysteryBoxWaitMessageEvent>(CancelMysteryBoxWaitMessageEvent, event =>
    {
        setMode('hidden');
        setPrizeData(undefined);
    });

    useMessageEvent<GotMysteryBoxPrizeMessageEvent>(GotMysteryBoxPrizeMessageEvent, event =>
    {
        const parser = event.getParser();
        setPrizeData({ contentType: parser.contentType, classId: parser.classId });
        setMode('prize');
    });

    const isOwner = GetSessionDataManager().userId === ownerId;

    if(mode === 'hidden') return null;

    return (
        <NitroCardView className="nitro-mysterybox-dialog" theme="primary-slim">
            <NitroCardHeaderView headerText={ mode === 'waiting' ? LocalizeText(`mysterybox.dialog.${ isOwner ? 'owner' : 'other' }.title`) : LocalizeText('mysterybox.reward.title') } onCloseClick={ close } />
            <NitroCardContentView>
                { mode === 'waiting' && <>
                    <Text variant="primary"> { LocalizeText(`mysterybox.dialog.${ isOwner ? 'owner' : 'other' }.subtitle`) } </Text>
                    <Text> { LocalizeText(`mysterybox.dialog.${ isOwner ? 'owner' : 'other' }.description`) } </Text>
                    <Text> { LocalizeText(`mysterybox.dialog.${ isOwner ? 'owner' : 'other' }.waiting`) }</Text>
                    <Button variant="danger" onClick={ close } className="mt-auto"> { LocalizeText(`mysterybox.dialog.${ isOwner ? 'owner' : 'other' }.cancel`) } </Button>
                </>
                }
                { mode === 'prize' && prizeData && <>
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
