import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';
import { useTheme } from '../../src/theme';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

// Icons are decorative; the tab label carries the meaning.
function tabIcon(name: IconName) {
  return ({ color, size }: { color: ColorValue; size: number }) => (
    <Ionicons
      name={name}
      size={size}
      color={color}
      testID={`tab-icon-${name}`}
      accessible={false}
      importantForAccessibility="no"
    />
  );
}

export default function TabsLayout() {
  const { colors, type } = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.onPrimary,
        headerTitleStyle: { color: colors.onPrimary },
        sceneStyle: { backgroundColor: colors.background },
        tabBarStyle: { backgroundColor: colors.surface },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        // Theme type scale; labels scale with the system font size.
        tabBarLabelStyle: { fontSize: type.caption.fontSize, lineHeight: type.caption.lineHeight },
        tabBarAllowFontScaling: true,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarAccessibilityLabel: 'Home tab', tabBarIcon: tabIcon('map') }} />
      <Tabs.Screen
        name="schedule"
        options={{ title: 'Schedule', tabBarAccessibilityLabel: 'Schedule tab', tabBarIcon: tabIcon('calendar') }}
      />
      <Tabs.Screen
        name="about"
        options={{ title: 'About', tabBarAccessibilityLabel: 'About tab', tabBarIcon: tabIcon('information-circle') }}
      />
    </Tabs>
  );
}
