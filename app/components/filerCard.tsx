import { Picker } from '@react-native-picker/picker';
import { Link } from "expo-router";
import React from 'react';
import { Text, TouchableOpacity, View } from "react-native";

interface FilterCardProps {
  selectedUserId: number;
  setSelectedUserId: (id: number) => void;
  filter: "all" | "active" | "done";
  setFilter: (f: "all" | "active" | "done") => void;
  sort: "recent" | "id";
  setSort: (s: "recent" | "id") => void;
  totalCount: number;
  completedCount: number;
  todos: { userId: number }[];
}

function FilterCard({
  selectedUserId,
  setSelectedUserId,
  filter,
  setFilter,
  sort,
  setSort,
  totalCount,
  completedCount,
  todos,
}: FilterCardProps) {
  const userIds = Array.from(new Set(todos.map(t => t.userId)));

  return (
    <View className="p-4 bg-gray-100 mb-2 rounded-3xl">
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
       <View className="bg-gray-900 rounded-full px-3 py-1 overflow-hidden">
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

      <View className="mt-4">
        <Text className="text-black font-bold mb-2 text-center">Filter</Text>
        <View className="flex-row items-stretch rounded-full border border-gray-800 overflow-hidden">
          <TouchableOpacity
            className={`flex-1 py-2 ${filter === 'all' ? 'bg-black' : 'bg-transparent'}`}
            onPress={() => setFilter('all')}
            accessibilityRole="button"
            accessibilityState={{ selected: filter === 'all' }}
          >
            <Text className={`text-center font-bold ${filter === 'all' ? 'text-white' : 'text-black'}`}>All</Text>
          </TouchableOpacity>
          <View className="w-px bg-gray-300" />
          <TouchableOpacity
            className={`flex-1 py-2 ${filter === 'active' ? 'bg-black' : 'bg-transparent'}`}
            onPress={() => setFilter('active')}
            accessibilityRole="button"
            accessibilityState={{ selected: filter === 'active' }}
          >
            <Text className={`text-center font-bold ${filter === 'active' ? 'text-white' : 'text-black'}`}>Active</Text>
          </TouchableOpacity>
          <View className="w-px bg-gray-300" />
          <TouchableOpacity
            className={`flex-1 py-2 ${filter === 'done' ? 'bg-black' : 'bg-transparent'}`}
            onPress={() => setFilter('done')}
            accessibilityRole="button"
            accessibilityState={{ selected: filter === 'done' }}
          >
            <Text className={`text-center font-bold ${filter === 'done' ? 'text-white' : 'text-black'}`}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="mt-4">
        <Text className="text-black font-bold mb-2 text-center">Sort By</Text>
        <View className="flex-row items-stretch rounded-full border border-gray-800 overflow-hidden">
          <TouchableOpacity
            className={`flex-1 py-2 ${sort === 'recent' ? 'bg-black' : 'bg-transparent'}`}
            onPress={() => setSort('recent')}
            accessibilityRole="button"
            accessibilityState={{ selected: sort === 'recent' }}
          >
            <Text className={`text-center font-bold ${sort === 'recent' ? 'text-white' : 'text-black'}`}>Recent</Text>
          </TouchableOpacity>
          <View className="w-px bg-gray-300" />
          <TouchableOpacity
            className={`flex-1 py-2 ${sort === 'id' ? 'bg-black' : 'bg-transparent'}`}
            onPress={() => setSort('id')}
            accessibilityRole="button"
            accessibilityState={{ selected: sort === 'id' }}
          >
            <Text className={`text-center font-bold ${sort === 'id' ? 'text-white' : 'text-black'}`}>ID</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text className="text-black text-center mt-4">
        User ID: {selectedUserId} | Total: {totalCount} | Completed: {completedCount}
      </Text>
    </View>
  );
}

const areEqual = (
  prev: Readonly<FilterCardProps>,
  next: Readonly<FilterCardProps>
) => {
  return (
    prev.selectedUserId === next.selectedUserId &&
    prev.filter === next.filter &&
    prev.sort === next.sort &&
    prev.totalCount === next.totalCount &&
    prev.completedCount === next.completedCount &&
    prev.todos === next.todos
  );
};

export default React.memo(FilterCard, areEqual);