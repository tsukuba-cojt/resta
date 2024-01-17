import t from '../features/translator';

export const pseudoClassOptions = [
  {
    label: t('normal_class'),
    value: '',
  },
  {
    label: t('hover_class'),
    value: ':hover',
  },
  {
    label: t('focus_class'),
    value: ':focus',
  },
  {
    label: t('first-letter_class'),
    value: ':first-letter',
  },
];

export const selectElementByOptions = [
  {
    label: t('select_element'),
    value: '',
  },
  {
    label: t('select_tag'),
    value: 'tag',
  },
];
