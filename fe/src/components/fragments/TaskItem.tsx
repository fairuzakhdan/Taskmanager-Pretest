import type { Task } from '../../types';
import Badge from '../elements/Badge';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, onDelete }) => {
  return (
    <>
      <h3 className="font-semibold text-lg">{task.title}</h3>
      {task.description && (
        <p className="text-gray-600 text-sm mt-1">
          {task.description}
        </p>
      )}
      <div className="flex justify-between items-center mt-2">
        <Badge variant={task.completed ? 'success' : 'warning'}>
          {task.completed ? 'Completed' : 'Pending'}
        </Badge>
        <div className="space-x-2">
          <button 
            className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
            onClick={() => onEdit(task)}
          >
            Edit
          </button>
          <button 
            className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded"
            onClick={() => onDelete(task.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );
};

export default TaskItem;
