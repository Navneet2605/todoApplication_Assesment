import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Todo } from "./todoSlice";

const TODOS_KEY = "@todos";

export async function getTodosFromStorage(): Promise<Todo[]> {
  try {
    const raw = await AsyncStorage.getItem(TODOS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Todo[];
  } catch (error) {
    console.error("Failed to read todos from storage", error);
    return [];
  }
}

export async function saveTodosToStorage(todos: Todo[]): Promise<void> {
  try {
    await AsyncStorage.setItem(TODOS_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error("Failed to save todos to storage", error);
  }
}


