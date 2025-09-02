
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, GestureResponderEvent, SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { addTodoThunk, updateTodoThunk } from "../store/todoSlice";

export default function AddTodoScreen() {
  const router = useRouter();
  const { userId, id, title: initialTitle } = useLocalSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  const [title, setTitle] = useState(String(initialTitle ?? ""));
  const [loading, setLoading] = useState(false);
  const isEditMode = Boolean(id);

  async function handleSubmit(event: GestureResponderEvent): Promise<void> {
    try {
      setLoading(true);
      const parsedUserId = Number(userId ?? 0) || 0;
      if (!title.trim()) {
        Alert.alert("Validation", "Please enter a title");
        setLoading(false);
        return;
      }
      if (isEditMode) {
        await dispatch(updateTodoThunk({ id: Number(id), title: title.trim() }));
      } else {
        await dispatch(addTodoThunk({ title: title.trim(), userId: parsedUserId }));
      }
      setLoading(false);
      router.back();
    } catch {
      setLoading(false);
      Alert.alert("Error", "Failed to add todo");
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white pt-6">
    <View className="p-6">
      <Text className="text-black text-2xl font-bold text-center mb-6">
        {isEditMode ? 'Update TODO' : 'Add TODO'}
      </Text>
      <Text className="text-black text-lg mb-4 text-center font-semibold">
        User ID: {userId}
      </Text>
      <TextInput
        className="bg-neutral-200 text-black p-3 rounded-3xl mb-4 py-4"
        placeholder="Todo Title"
        placeholderTextColor="#888"
        value={title}
        onChangeText={setTitle}
      />
      <TouchableOpacity
        className={`bg-black rounded-3xl py-4 ${!title || loading ? "opacity-60" : ""}`}
        onPress={handleSubmit}
        disabled={!title || loading}
      >
        <Text className="text-white text-center text-lg font-semibold">
          {loading ? (isEditMode ? "Updating..." : "Adding...") : (isEditMode ? "Update Todo" : "Add Todo")}
        </Text>
      </TouchableOpacity>
    </View>
  </SafeAreaView>
  );
}