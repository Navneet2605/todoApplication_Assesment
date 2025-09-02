export const fetchTodos = async () => {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");
    const data = await response.json();
    return data.map((todo: any) => ({
      ...todo,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching todos:", error);
    return [];
  }
};