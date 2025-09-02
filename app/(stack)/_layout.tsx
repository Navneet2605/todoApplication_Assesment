import { Provider } from "react-redux";
import { store } from "../store";
import { Stack } from "expo-router";

export default function StackLayout() {
  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="main" options={{ title: "Todo List" }} />
        <Stack.Screen name="add-todo" options={{ title: "Add Todo" }} />
      </Stack>
    </Provider>
  );
}