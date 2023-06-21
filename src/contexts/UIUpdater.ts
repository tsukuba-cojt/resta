import React, { useCallback, useState } from 'react';

type UIUpdaterContext = {
    changeFormatObserver: number;
    formatChanged: () => void;
};

export const defaultUIUpdater: UIUpdaterContext = {
    changeFormatObserver: 0,
    formatChanged: () => {},
};

export const UIUpdaterContext = React.createContext<UIUpdaterContext>(
    defaultUIUpdater
);

export const useUIUpdater = (): UIUpdaterContext => {
    const [changeFormatObserver, setChangeFormatObserver] = useState<number>(0);

    const formatChanged = useCallback(() => {
        setChangeFormatObserver(changeFormatObserver + 1);
    }, []);

    return { changeFormatObserver, formatChanged };
};
