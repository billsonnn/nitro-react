import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RedeemVoucherMessageComposer, VoucherRedeemErrorMessageEvent, VoucherRedeemOkMessageEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { LocalizeText, NotificationUtilities, SendMessageComposer } from '../../../../../api';
import { Button, Flex } from '../../../../../common';
import { BatchUpdates, UseMessageEventHook } from '../../../../../hooks';

export interface CatalogRedeemVoucherViewProps
{
    text: string;
}

export const CatalogRedeemVoucherView: FC<CatalogRedeemVoucherViewProps> = props =>
{
    const { text = null } = props;
    const [ voucher, setVoucher ] = useState<string>('');
    const [ isWaiting, setIsWaiting ] = useState(false);

    const redeemVoucher = () =>
    {
        if(!voucher || !voucher.length || isWaiting) return;

        SendMessageComposer(new RedeemVoucherMessageComposer(voucher));

        setIsWaiting(true);
    }

    const onVoucherRedeemOkMessageEvent = useCallback((event: VoucherRedeemOkMessageEvent) =>
    {
        const parser = event.getParser();

        let message = LocalizeText('catalog.alert.voucherredeem.ok.description');

        if(parser.productName) message = LocalizeText('catalog.alert.voucherredeem.ok.description.furni', [ 'productName', 'productDescription' ], [ parser.productName, parser.productDescription ]);

        NotificationUtilities.simpleAlert(message, null, null, null, LocalizeText('catalog.alert.voucherredeem.ok.title'));
        
        BatchUpdates(() =>
        {
            setIsWaiting(false);
            setVoucher('');
        });
    }, []);

    UseMessageEventHook(VoucherRedeemOkMessageEvent, onVoucherRedeemOkMessageEvent);

    const onVoucherRedeemErrorMessageEvent = useCallback((event: VoucherRedeemErrorMessageEvent) =>
    {
        const parser = event.getParser();

        NotificationUtilities.simpleAlert(LocalizeText(`catalog.alert.voucherredeem.error.description.${ parser.errorCode }`), null, null, null, LocalizeText('catalog.alert.voucherredeem.error.title'));

        setIsWaiting(false);
    }, []);

    UseMessageEventHook(VoucherRedeemErrorMessageEvent, onVoucherRedeemErrorMessageEvent);

    return (
        <Flex gap={ 1 }>
            <input type="text" className="form-control form-control-sm" placeholder={ text } value={ voucher } onChange={ event => setVoucher(event.target.value) } />
            <Button variant="primary" size="sm" onClick={ redeemVoucher } disabled={ isWaiting }>
                <FontAwesomeIcon icon="tag" />
            </Button>
        </Flex>
    );
}
