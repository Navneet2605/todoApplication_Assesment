import { Picker } from '@react-native-picker/picker';
import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

interface FilterCardProps {
  selectedUserId: number;
  setSelectedUserId: (id: number) => void;
  filter: "all" | "active" | "done";
  setFilter: (f: "all" | "active" | "done") => void;
  totalCount: number;
  completedCount: number;
  todos: { userId: number }[];
}

export default function FilterCard({
  selectedUserId,
  setSelectedUserId,
  filter,
  setFilter,
  totalCount,
  completedCount,
  todos,
}: FilterCardProps) {
  const userIds = Array.from(new Set(todos.map(t => t.userId)));

  return (
    <View className="p-4 bg-gray-400 mb-2 rounded-3xl">
        <View className="flex-1 items-center justify-center mb-4 ">
             <Text className="font-bold text-lg">TODO</Text>
        </View>
        <Link
        href={{
          pathname: "/(stack)/add-todo",
          params: { userId: selectedUserId },
        }}
        asChild
      >
         <TouchableOpacity className="bg-black py-4 rounded-full items-center">
           <Text className="text-white text-center">Add New Todo</Text>
         </TouchableOpacity>
       </Link>
      
      <View className="mt-4">
        <Text className="text-black font-bold mb-2 text-center">Select User ID</Text>
       <View className="bg-black rounded-full px-3 py-1 overflow-hidden">
  <Picker
    selectedValue={selectedUserId}
    onValueChange={setSelectedUserId}
    style={{ color: 'white' }} 
    dropdownIconColor="white"
  >
    {userIds.map((userId) => (
      <Picker.Item
        key={userId}
        label={`User ${userId}`}
        value={userId}
        color="black"
      />
    ))}
  </Picker>
</View>
      </View>
      <View className="flex-row justify-around mt-4">
        <TouchableOpacity
          className={`px-4 py-2 mx-1 rounded-full ${filter === 'all' ? 'bg-black' : 'bg-gray-600'}`}
          onPress={() => setFilter('all')}
        >
          <Text className="text-white font-bold">All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`px-4 py-2 mx-1 rounded-full ${filter === 'active' ? 'bg-black' : 'bg-gray-600'}`}
          onPress={() => setFilter('active')}
        >
          <Text className="text-white font-bold">Active</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`px-4 py-2 mx-1 rounded-full ${filter === 'done' ? 'bg-black' : 'bg-gray-600'}`}
          onPress={() => setFilter('done')}
        >
          <Text className="text-white font-bold">Done</Text>
        </TouchableOpacity>
      </View>
      <Text className="text-white text-center mt-4">
        User ID: {selectedUserId} | Total: {totalCount} | Completed: {completedCount}
      </Text>
    </View>
  );
}