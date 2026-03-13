import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '../services/taskApi';
import type { Task } from '../types';

export const useTasks = (token: string | null) => {
  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: ['tasks'],
    queryFn: () => taskApi.getMyTasks(token!),
    enabled: !!token,
  });

  const createMutation = useMutation({
    mutationFn: (data: { title: string; description?: string; completed?: boolean }) =>
      taskApi.createTask(token!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Task> }) =>
      taskApi.updateTask(token!, id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previous = queryClient.getQueryData<Task[]>(['tasks']);
      
      queryClient.setQueryData<Task[]>(['tasks'], (old) =>
        old?.map((task) => (task.id === id ? { ...task, ...data } : task))
      );
      
      return { previous };
    },
    onError: (_, __, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['tasks'], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => taskApi.deleteTask(token!, id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previous = queryClient.getQueryData<Task[]>(['tasks']);
      
      queryClient.setQueryData<Task[]>(['tasks'], (old) =>
        old?.filter((task) => task.id !== id)
      );
      
      return { previous };
    },
    onError: (_, __, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['tasks'], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  return {
    tasks: tasksQuery.data ?? [],
    isLoading: tasksQuery.isLoading,
    error: tasksQuery.error,
    createTask: createMutation.mutateAsync,
    updateTask: updateMutation.mutateAsync,
    deleteTask: deleteMutation.mutateAsync,
  };
};
