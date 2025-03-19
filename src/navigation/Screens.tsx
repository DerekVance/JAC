import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  Home,
  JAC,
} from '../screens';

import {useScreenOptions, useTranslation} from '../hooks';

const Stack = createStackNavigator();

export default () => {
  const {t} = useTranslation();
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={{
      ...screenOptions.stack,
      headerTitleAlign: 'left' as const
    }}>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{title: t('navigation.home')}}
      />

      <Stack.Screen
        name="JAC"
        component={JAC}
        options={{
          title: t('navigation.jac'),
          ...screenOptions.stack,
          headerTitleAlign: 'left' as const
        }}
      />
    </Stack.Navigator>
  );
};
