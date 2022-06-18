import { EffectCallback, useEffect } from 'react';


// eslint-disable-next-line react-hooks/exhaustive-deps
const useEffectOnce = (effect: EffectCallback) => useEffect(effect, []);

export const UseMountEffect = (fn: Function) => useEffectOnce(() => fn());
