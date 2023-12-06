import React, { Dispatch, useCallback, useState } from 'react';
import { FormatBlockByURL } from '../types/Format';
import { ImportedFormat } from '../features/prop';
import useCommandExecutor, {
  CommandExecutor,
} from 'react-command-lib/dist/esm';

export type IPropsContext = {
  /**
   * 現在のURL
   */
  currentUrl: string;
  setCurrentUrl: Dispatch<string>;

  /**
   * 編集中のURL
   */
  editedUrl: string;
  setEditedUrl: Dispatch<string>;

  /**
   * フォーマット配列
   */
  formatsArray: FormatBlockByURL[];
  setFormatsArray: Dispatch<FormatBlockByURL[]>;

  /**
   * インポートされたフォーマット
   */
  importedFormats: ImportedFormat[];
  setImportedFormats: Dispatch<ImportedFormat[]>;

  /**
   * コマンドマネージャ
   */
  executor: CommandExecutor;
};

const defaultPropsContext: IPropsContext = {
  currentUrl: '',
  setCurrentUrl: () => undefined,
  editedUrl: '',
  setEditedUrl: () => undefined,
  formatsArray: [],
  setFormatsArray: () => undefined,
  importedFormats: [],
  setImportedFormats: () => undefined,
  executor: {
    execute: () => undefined,
    undo: () => undefined,
    redo: () => undefined,
    isRedoable: false,
    isUndoable: false,
  },
};

export const PropsContext =
  React.createContext<IPropsContext>(defaultPropsContext);

function useMemoizedState<T>(
  defaultValue: T,
): [value: T, setValue: Dispatch<T>] {
  const [value, _setValue] = useState<T>(defaultValue);
  const setValue = useCallback((v: T) => _setValue(v), []);

  return [value, setValue];
}

export default function usePropsContext(): IPropsContext {
  const [currentUrl, setCurrentUrl] = useMemoizedState<string>(
    defaultPropsContext.currentUrl,
  );
  const [editedUrl, setEditedUrl] = useMemoizedState<string>(
    defaultPropsContext.currentUrl,
  );
  const [formatsArray, setFormatsArray] = useMemoizedState<FormatBlockByURL[]>(
    [],
  );
  const [importedFormats, setImportedFormats] = useMemoizedState<
    ImportedFormat[]
  >([]);
  const executor = useCommandExecutor();

  return {
    currentUrl,
    setCurrentUrl,
    editedUrl,
    setEditedUrl,
    formatsArray,
    setFormatsArray,
    importedFormats,
    setImportedFormats,
    executor,
  };
}
