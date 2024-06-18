import { RedeemVoucherMessageComposer, VoucherRedeemErrorMessageEvent, VoucherRedeemOkMessageEvent } from '@nitrots/nitro-renderer';
import { FC, useState } from 'react';
import { FaTag } from 'react-icons/fa';
import { LocalizeText, SendMessageComposer } from '../../../../../api';
import { Button } from '../../../../../common';
import { useMessageEvent, useNotification } from '../../../../../hooks';
import { NitroInput } from '../../../../../layout';

export interface CatalogRedeemVoucherViewProps
{
    text: string;
}

export const CatalogRedeemVoucherView: FC<CatalogRedeemVoucherViewProps> = props =>
{
    const { text = null } = props;
    const [ voucher, setVoucher ] = useState<string>('');
    const [ isWaiting, setIsWaiting ] = useState(false);
    const { simpleAlert = null } = useNotification();

    const redeemVoucher = () =>
    {
        if(!voucher || !voucher.length || isWaiting) return;

        SendMessageComposer(new RedeemVoucherMessageComposer(voucher));

        setIsWaiting(true);
    };

    useMessageEvent<VoucherRedeemOkMessageEvent>(VoucherRedeemOkMessageEvent, event =>
    {
        const parser = event.getParser();

        let message = LocalizeText('catalog.alert.voucherredeem.ok.description');

        if(parser.productName) message = LocalizeText('catalog.alert.voucherredeem.ok.description.furni', [ 'productName', 'productDescription' ], [ parser.productName, parser.productDescription ]);

        simpleAlert(message, null, null, null, LocalizeText('catalog.alert.voucherredeem.ok.title'));

        setIsWaiting(false);
        setVoucher('');
    });

    useMessageEvent<VoucherRedeemErrorMessageEvent>(VoucherRedeemErrorMessageEvent, event =>
    {
        const parser = event.getParser();

        simpleAlert(LocalizeText(`catalog.alert.voucherredeem.error.description.${ parser.errorCode }`), null, null, null, LocalizeText('catalog.alert.voucherredeem.error.title'));

        setIsWaiting(false);
    });

    return (
        <div className="flex gap-1">



            <NitroInput
                placeholder={ text }
                value={ voucher }
                onChange={ event => setVoucher(event.target.value) } />
            <Button disabled={ isWaiting } variant="primary" onClick={ redeemVoucher }>
                <FaTag className="fa-icon" />
            </Button>
        </div>
    );
};
