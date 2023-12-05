import { useContext, useEffect } from 'react';
import { PropsContext } from '../contexts/PropsContext';
import { loadFormat, loadImportedStyle } from '../features/format_manager';

export default function Controller() {
  const prop = useContext(PropsContext);

  prop.setCurrentUrl(window.location.href);
  prop.setEditedUrl(window.location.href);

  useEffect(() => {
    // do something
    loadFormat(prop);
    loadImportedStyle(prop);
  }, []);

  return null;
}
