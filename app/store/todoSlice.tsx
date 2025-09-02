import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchTodos } from "../api/todosApi";
import { getTodosFromStorage, saveTodosToStorage } from "./todosStorage";

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
  created_at?: string;
  updated_at?: string;
}

interface TodoState {
  items: Todo[];
  filter: "all" | "active" | "done";
  sort: "recent" | "id";
}

const initialState: TodoState = {
  items: [],
  filter: "all",
  sort: "recent",
};

// Fetch todos from API
export const getTodos = createAsyncThunk("todos/getTodos", async () => {
  return await fetchTodos();
});

// Load todos from AsyncStorage
export const loadTodosFromStorage = createAsyncThunk("todos/loadFromStorage", async () => {
  const stored = await getTodosFromStorage();
  return stored;
});

// If storage empty, seed from API and persist
export const seedTodosFromApiIfEmpty = createAsyncThunk("todos/seedIfEmpty", async (_, { getState }) => {
  const state = getState() as { todos: TodoState };
  if (state.todos.items.length > 0) {
    return state.todos.items;
  }
  const apiTodos = await fetchTodos();
  await saveTodosToStorage(apiTodos);
  return apiTodos;
});

// Add todo and persist
export const addTodoThunk = createAsyncThunk(
  "todos/addTodoThunk",
  async (payload: { title: string; userId: number }, { getState, dispatch }) => {
    dispatch(addTodo(payload));
    const state = getState() as { todos: TodoState };
    await saveTodosToStorage(state.todos.items);
    return state.todos.items;
  }
);

// Toggle todo and persist
export const toggleTodoThunk = createAsyncThunk(
  "todos/toggleTodoThunk",
  async (id: number, { getState, dispatch }) => {
    dispatch(toggleTodo(id));
    const state = getState() as { todos: TodoState };
    await saveTodosToStorage(state.todos.items);
    return state.todos.items;
  }
);

// Delete todo and persist (not currently used by UI)
export const deleteTodoThunk = createAsyncThunk(
  "todos/deleteTodoThunk",
  async (id: number, { getState, dispatch }) => {
    dispatch(deleteTodo(id));
    const state = getState() as { todos: TodoState };
    await saveTodosToStorage(state.todos.items);
    return state.todos.items;
  }
);

// Update todo title and persist
export const updateTodoThunk = createAsyncThunk(
  "todos/updateTodoThunk",
  async (payload: { id: number; title: string }, { getState, dispatch }) => {
    dispatch(updateTodo(payload));
    const state = getState() as { todos: TodoState };
    await saveTodosToStorage(state.todos.items);
    return state.todos.items;
  }
);

const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<{ title: string; userId: number }>) => {
      const newTodo: Todo = {
        id: Date.now(),
        title: action.payload.title,
        completed: false,
        userId: action.payload.userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      state.items.unshift(newTodo);
    },
    toggleTodo: (state, action: PayloadAction<number>) => {
      const todo = state.items.find((t) => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        todo.updated_at = new Date().toISOString();
      }
    },
    deleteTodo: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((t) => t.id !== action.payload);
    },
    updateTodo: (state, action: PayloadAction<{ id: number; title: string }>) => {
      const todo = state.items.find(t => t.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title;
        todo.updated_at = new Date().toISOString();
      }
    },
    setFilter: (state, action: PayloadAction<"all" | "active" | "done">) => {
      state.filter = action.payload;
    },
    setSort: (state, action: PayloadAction<"recent" | "id">) => {
      state.sort = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getTodos.fulfilled, (state, action) => {
      state.items = action.payload;
    });
    builder.addCase(loadTodosFromStorage.fulfilled, (state, action) => {
      if (action.payload && action.payload.length > 0) {
        state.items = action.payload;
      }
    });
    builder.addCase(seedTodosFromApiIfEmpty.fulfilled, (state, action) => {
      if (action.payload && action.payload.length > 0) {
        state.items = action.payload;
      }
    });
    builder.addCase(addTodoThunk.fulfilled, (state) => state);
    builder.addCase(toggleTodoThunk.fulfilled, (state) => state);
    builder.addCase(deleteTodoThunk.fulfilled, (state) => state);
    builder.addCase(updateTodoThunk.fulfilled, (state) => state);
  },
});

export const { addTodo, toggleTodo, deleteTodo, updateTodo, setFilter, setSort } = todoSlice.actions;
export default todoSlice.reducer;