import { useEffect } from 'react';

export const UseMountEffect = (fun: Function) => useEffect(() => fun(), []);
