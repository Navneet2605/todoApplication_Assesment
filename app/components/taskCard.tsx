

import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

type TaskCardProps = {
  title: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
  onToggle?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export const TaskCard: React.FC<TaskCardProps> = ({
  title,
  completed,
  created_at,
  updated_at,
  onToggle,
  onEdit,
  onDelete,
}) => {
  const formatDateTime = (value: string) => {
    if (!value) return "";
    const d = new Date(value);
    return d.toLocaleString(undefined, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const progress = useSharedValue(completed ? 1 : 0); // 0: unchecked, 1: checked
  const ripple = useSharedValue(0); // 0 -> 1 while animating ripple

  useEffect(() => {
    progress.value = withTiming(completed ? 1 : 0, { duration: 220, easing: Easing.out(Easing.quad) });
    // trigger a short ripple when state changes
    ripple.value = 0;
    ripple.value = withTiming(1, { duration: 380, easing: Easing.out(Easing.cubic) });
  }, [completed, progress, ripple]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: progress.value > 0.5 ? 'rgb(187, 247, 208)' : 'rgb(254, 202, 202)', // green-200 : red-200
    };
  });

  const checkboxBgStyle = useAnimatedStyle(() => {
    // Interpolate from white to green for the box fill
    const backgroundColor = progress.value > 0.5 ? 'rgb(21, 128, 61)' : 'white'; // green-700 : white
    const borderColor = progress.value > 0.5 ? 'rgb(21, 128, 61)' : 'rgb(107, 114, 128)'; // green-700 : gray-500
    return { backgroundColor, borderColor } as any;
  });

  const checkIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withTiming(progress.value, { duration: 200, easing: Easing.out(Easing.quad) }) }],
      opacity: withTiming(progress.value, { duration: 180 })
    };
  });

  const rippleStyle = useAnimatedStyle(() => {
    // expand from the checkbox position
    const size = 16 + ripple.value * 800; // grow big enough to cover the card
    const opacity = 0.18 * (1 - ripple.value);
    const color = progress.value > 0.5 ? 'rgb(21, 128, 61)' : 'rgb(239, 68, 68)'; // green-700 or red-500
    return {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: color,
      opacity,
    } as any;
  });

  return (
    <Animated.View className={`p-4 rounded-3xl mb-4`} style={[animatedStyle, { position: 'relative', overflow: 'hidden' }] }>
      {/* Ripple that originates roughly from the checkbox position (top-left inside card padding) */}
      <Animated.View style={[{ position: 'absolute', top: 14, left: 14 }, rippleStyle]} />

      <Text className="text-lg font-semibold mb-2">{title}</Text>
      <Text className="mb-1">
        Status: <Text className={completed ? 'text-green-700' : 'text-red-700'}>{completed ? 'Completed' : 'Pending'}</Text>
      </Text>
      <Text className="text-xs text-gray-600 mb-1">Created: {formatDateTime(created_at)}</Text>
      <Text className="text-xs text-gray-600">Updated: {formatDateTime(updated_at)}</Text>
      <View className="flex-row mt-3 items-center justify-between">
        <TouchableOpacity onPress={onToggle} className="self-start px-2" accessibilityRole="checkbox" accessibilityState={{ checked: completed }}>
          <Animated.View className="w-8 h-8 rounded-md  items-center justify-center" style={checkboxBgStyle}>
            <Animated.View style={checkIconStyle}>
              <Ionicons name="checkmark" size={16} color="white" />
            </Animated.View>
          </Animated.View>
        </TouchableOpacity>
        <View className="flex-row" style={{ gap: 12 }}>
          <TouchableOpacity onPress={onEdit} className="px-3 py-2 rounded-lg bg-black">
            <Ionicons name="pencil" size={16} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete} className="px-3 py-2 rounded-lg bg-red-600">
            <Ionicons name="trash" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};
export default TaskCard;