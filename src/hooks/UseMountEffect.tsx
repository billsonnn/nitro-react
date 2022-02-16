import { EffectCallback, useEffect } from 'react';


const useEffectOnce = (effect: EffectCallback) => useEffect(effect, []);

export const UseMountEffect = (fn: Function) => useEffectOnce(() => fn());
