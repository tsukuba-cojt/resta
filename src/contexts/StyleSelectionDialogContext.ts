import React, { useCallback, useState } from 'react';

type StyleSelectionDialogContext = {
  opened: boolean;
  setOpened: (value: boolean) => void;
};

export const defaultStyleSelectionDialog: StyleSelectionDialogContext = {
  opened: false,
  setOpened: () => {},
};

export const StyleSelectionDialogContext =
  React.createContext<StyleSelectionDialogContext>(defaultStyleSelectionDialog);

export const useStyleSelectionDialog = (): StyleSelectionDialogContext => {
  const [opened, _setOpened] = useState<boolean>(false);

  const setOpened = useCallback((value: boolean) => {
    _setOpened(value);
  }, []);

  return { opened, setOpened };
};
