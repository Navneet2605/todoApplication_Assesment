import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../store";

export default function StackLayout() {
  return (
    <Provider store={store}>
      <Stack >
        <Stack.Screen name="main" options={{ title: "Todo List" , headerShown: false}} />
        <Stack.Screen name="add-todo" options={{ title: "Add Todo" , headerShown: true}} />
      </Stack>
    </Provider>
  );
}