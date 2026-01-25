import React from 'react';
import { PayPalScriptProvider as PayPalProvider } from '@paypal/react-paypal-js';

const PayPalScriptProvider = ({ children }) => {
    const initialOptions = {
        clientId: 'AVZSbRK7Qfrpl7fdbYhVF9kduE0PcuIDVdjc8rqfuhQPRMUtVBc3EvBFUmcBBAqHIzCaEt4ARIZm63P1',
        currency: 'USD',
        intent: 'capture',
        components: 'buttons,card-fields',
    };

    return (
        <PayPalProvider options={initialOptions}>
            {children}
        </PayPalProvider>
    );
};

export default PayPalScriptProvider;