import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import FilterCard from "../components/filerCard";
import { TaskCard } from "../components/taskCard";
import { AppDispatch, RootState } from "../store";
import { deleteTodoThunk, loadTodosFromStorage, seedTodosFromApiIfEmpty, setFilter, setSort, toggleTodoThunk } from "../store/todoSlice";

export default function MainScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  // Select state with shallowEqual to reduce re-renders when array identity is stable
  const todos = useSelector((state: RootState) => state.todos.items, shallowEqual);
  const filter = useSelector((state: RootState) => state.todos.filter);
  const sort = useSelector((state: RootState) => state.todos.sort);
  const [selectedUserId, setSelectedUserId] = useState(1);

  // On mount: hydrate from storage, then seed from API if empty
  useEffect(() => {
    (async () => {
      const action = await dispatch(loadTodosFromStorage());
      const payload = (action as any).payload as unknown[] | undefined;
      if (!payload || payload.length === 0) {
        await dispatch(seedTodosFromApiIfEmpty());
      }
    })();
  }, [dispatch]);

  // Derive available userIds once per todos change
  const userIds = useMemo(() => Array.from(new Set(todos.map(t => t.userId))), [todos]);

  // Filter and sort are memoized to avoid recomputation and unnecessary list re-renders
  const filteredTodos = useMemo(() => {
    const filtered = todos.filter((todo) => {
      const matchesUser = todo.userId === selectedUserId;
      if (!matchesUser) return false;
      if (filter === "all") return true;
      if (filter === "active") return !todo.completed;
      if (filter === "done") return todo.completed;
      return true;
    });

    const list = [...filtered];
    if (sort === "recent") {
      list.sort((a, b) => {
        const aTime = new Date(a.updated_at ?? a.created_at ?? 0).getTime();
        const bTime = new Date(b.updated_at ?? b.created_at ?? 0).getTime();
        return bTime - aTime; // most recent first
      });
    } else if (sort === "id") {
      list.sort((a, b) => a.id - b.id);
    }
    return list;
  }, [todos, selectedUserId, filter, sort]);

  // Simple derived counts; memoized because they depend on filteredTodos
  const totalCount = useMemo(() => filteredTodos.length, [filteredTodos]);
  const completedCount = useMemo(
    () => filteredTodos.filter((t) => t.completed).length,
    [filteredTodos]
  );

  // Stable callbacks to keep row components memoized
  const handleToggle = useCallback((id: number) => {
    dispatch(toggleTodoThunk(id));
  }, [dispatch]);

  const handleDelete = useCallback((id: number) => {
    dispatch(deleteTodoThunk(id));
  }, [dispatch]);

  const handleEdit = useCallback((userId: number, id: number, title: string) => {
    router.push({ pathname: "/(stack)/add-todo", params: { userId: String(userId), id: String(id), title } });
  }, [router]);

  // Render and key functions are memoized for FlatList perf
  const renderItem = useCallback(({ item }: { item: any }) => (
    <TaskCard
      title={item.title}
      completed={item.completed}
      created_at={item.created_at ?? ""}
      updated_at={item.updated_at ?? ""}
      onToggle={() => handleToggle(item.id)}
      onDelete={() => handleDelete(item.id)}
      onEdit={() => handleEdit(item.userId, item.id, item.title)}
    />
  ), [handleToggle, handleDelete, handleEdit]);

  const keyExtractor = useCallback((item: any) => item.id?.toString() ?? Math.random().toString(), []);

  // Wrap dispatchers to keep props stable for FilterCard
  const setFilterMemo = useCallback((f: "all" | "active" | "done") => dispatch(setFilter(f)), [dispatch]);
  const setSortMemo = useCallback((s: "recent" | "id") => dispatch(setSort(s)), [dispatch]);

  const contentContainerStyle = useMemo(() => ({ paddingBottom: 20 }), []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        className=""
        data={filteredTodos}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={
          <FilterCard
            selectedUserId={selectedUserId}
            setSelectedUserId={setSelectedUserId}
            filter={filter}
            setFilter={setFilterMemo}
            sort={sort}
            setSort={setSortMemo}
            totalCount={totalCount}
            completedCount={completedCount}
            userIds={userIds}
          />
        }
        // Sticky header styling to avoid flicker; keep header background solid
        ListHeaderComponentStyle={{ zIndex: 2, backgroundColor: 'white' }}
        stickyHeaderIndices={[0]}
        contentContainerStyle={contentContainerStyle}
        // Disable clipping to avoid header flicker while scrolling
        removeClippedSubviews={false}
        initialNumToRender={12}
        windowSize={7}
      />
    </SafeAreaView>
  );
}