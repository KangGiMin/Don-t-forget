import { StyleSheet } from 'react-native';
import { screenStyles } from './screen';
import { headerStyles } from './header';
import { progressStyles } from './progress';
import { dateNavigationStyles } from './dateNavigation';
import { filterStyles } from './filters';
import { modalSharedStyles } from './modals/shared';
import { calendarModalStyles } from './modals/calendar';
import { settingsModalStyles } from './modals/settings';

export const createMainScreenStyles = (colors) => StyleSheet.create({
  ...screenStyles(colors),
  ...headerStyles(colors),
  ...progressStyles(colors),
  ...dateNavigationStyles(colors),
  ...filterStyles(colors),
  ...modalSharedStyles(colors),
  ...calendarModalStyles(colors),
  ...settingsModalStyles(colors),
});