import { RedeemVoucherMessageComposer, VoucherRedeemErrorMessageEvent, VoucherRedeemOkMessageEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { CreateMessageHook, SendMessageHook } from '../../../../../hooks';
import { CatalogRedeemVoucherViewProps } from './CatalogRedeemVoucherView.types';

export const CatalogRedeemVoucherView: FC<CatalogRedeemVoucherViewProps> = props =>
{
    const { text = null } = props;
    const [ voucher, setVoucher ] = useState<string>('');
    const [ isWaiting, setIsWaiting ] = useState(false);

    const redeemVoucher = useCallback(() =>
    {
        if(!voucher || !voucher.length || isWaiting) return;

        SendMessageHook(new RedeemVoucherMessageComposer(voucher));

        setIsWaiting(true);
    }, [ voucher, isWaiting ]);

    const onVoucherRedeemOkMessageEvent = useCallback((event: VoucherRedeemOkMessageEvent) =>
    {
        const parser = event.getParser();
        
        console.log(event);
        setIsWaiting(false);
    }, []);

    CreateMessageHook(VoucherRedeemOkMessageEvent, onVoucherRedeemOkMessageEvent);

    const onVoucherRedeemErrorMessageEvent = useCallback((event: VoucherRedeemErrorMessageEvent) =>
    {
        const parser = event.getParser();

        console.log(event);
        setIsWaiting(false);
    }, []);

    CreateMessageHook(VoucherRedeemErrorMessageEvent, onVoucherRedeemErrorMessageEvent);

    return (
        <div className="d-flex">
            <div className="d-flex flex-grow-1 me-1">
                <input type="text" className="form-control form-control-sm" placeholder={ text } value={ voucher } onChange={ event => setVoucher(event.target.value) } />
            </div>
            <div className="d-flex">
                <button type="button" className="btn btn-primary btn-sm" onClick={ redeemVoucher } disabled={ isWaiting }>
                    <i className="fas fa-tag"></i>
                </button>
            </div>
        </div>
    )
}
