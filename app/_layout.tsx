import { Stack } from "expo-router";
import "./global.css"

export default function RootLayout() {
  return(
    <Stack>
      <Stack.Screen name="(stack)" options={{ headerShown: false }} />
    </Stack>
  ) ;
}
