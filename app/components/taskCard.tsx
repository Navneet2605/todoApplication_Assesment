

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

const TaskCard: React.FC<TaskCardProps> = ({
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

  const progress = useSharedValue(completed ? 1 : 0); 
  const ripple = useSharedValue(0); 

  useEffect(() => {
    progress.value = withTiming(completed ? 1 : 0, { duration: 220, easing: Easing.out(Easing.quad) });
    
    ripple.value = 0;
    ripple.value = withTiming(1, { duration: 380, easing: Easing.out(Easing.cubic) });
  }, [completed, progress, ripple]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: progress.value > 0.5 ? 'rgb(229, 231, 235)' : 'rgb(243, 244, 246)',
    };
  });

  const checkboxBgStyle = useAnimatedStyle(() => {
    const backgroundColor = progress.value > 0.5 ? 'black' : 'white';
    const borderColor = progress.value > 0.5 ? 'black' : 'rgb(107, 114, 128)';
    return { backgroundColor, borderColor } as any;
  });

  const checkIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withTiming(progress.value, { duration: 200, easing: Easing.out(Easing.quad) }) }],
      opacity: withTiming(progress.value, { duration: 180 })
    };
  });

  const rippleStyle = useAnimatedStyle(() => {
    const size = 16 + ripple.value * 800;
    const opacity = 0.12 * (1 - ripple.value);
    const color = 'black';
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
        Status: <Text className={completed ? 'text-gray-900' : 'text-gray-600'}>{completed ? 'Done' : 'Active'}</Text>
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
          <TouchableOpacity onPress={onDelete} className="px-3 py-2 rounded-lg bg-gray-800">
            <Ionicons name="trash" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const areEqual = (
  prev: Readonly<TaskCardProps>,
  next: Readonly<TaskCardProps>
) => {
  return (
    prev.title === next.title &&
    prev.completed === next.completed &&
    prev.created_at === next.created_at &&
    prev.updated_at === next.updated_at
  );
};

const MemoTaskCard = React.memo(TaskCard, areEqual);

export { MemoTaskCard as TaskCard };
export default MemoTaskCard;