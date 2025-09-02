import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import FilterCard from "../components/filerCard";
import { TaskCard } from "../components/taskCard";
import { AppDispatch, RootState } from "../store";
import { deleteTodoThunk, loadTodosFromStorage, seedTodosFromApiIfEmpty, setFilter, toggleTodoThunk } from "../store/todoSlice";

export default function MainScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const todos = useSelector((state: RootState) => state.todos.items);
  const filter = useSelector((state: RootState) => state.todos.filter);
  const [selectedUserId, setSelectedUserId] = useState(1);

  useEffect(() => {
    (async () => {
      const action = await dispatch(loadTodosFromStorage());
      const payload = (action as any).payload as unknown[] | undefined;
      if (!payload || payload.length === 0) {
        await dispatch(seedTodosFromApiIfEmpty());
      }
    })();
  }, [dispatch]);
  const filteredTodos = todos.filter((todo) => {
    const matchesUser = todo.userId === selectedUserId;
    if (!matchesUser) return false;

    if (filter === "all") return true;
    if (filter === "active") return !todo.completed;
    if (filter === "done") return todo.completed;

    return true;
  });

  const totalCount = filteredTodos.length;
  const completedCount = filteredTodos.filter((t) => t.completed).length;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        className="py-2"
        data={filteredTodos}
        keyExtractor={(item) =>
          item.id?.toString() ?? Math.random().toString()
        }
        renderItem={({ item }) => (
          <TaskCard
            title={item.title}
            completed={item.completed}
            created_at={item.created_at ?? ""}
            updated_at={item.updated_at ?? ""}
            onToggle={() => dispatch(toggleTodoThunk(item.id))}
            onDelete={() => dispatch(deleteTodoThunk(item.id))}
            onEdit={() => {
              router.push({ pathname: "/(stack)/add-todo", params: { userId: String(item.userId), id: String(item.id), title: item.title } });
            }}
          />
        )}
        ListHeaderComponent={
          <FilterCard
            selectedUserId={selectedUserId}
            setSelectedUserId={setSelectedUserId}
            filter={filter}
            setFilter={(f) => dispatch(setFilter(f))}
            totalCount={totalCount}
            completedCount={completedCount}
            todos={todos}
          />
        }
        stickyHeaderIndices={[0]}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}