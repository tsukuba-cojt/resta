import { useContext, useEffect } from 'react';
import { PropsContext } from '../contexts/PropsContext';
import { loadFormat, loadImportedStyle } from '../features/format_manager';

export default function Controller() {
  const prop = useContext(PropsContext);

  useEffect(() => {
    // do something
    loadFormat(prop);
    loadImportedStyle(prop);
  }, []);

  return null;
}
