import type { Task } from '../../types';
import { Text, Badge, Button } from '../elements';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, onDelete }) => {
  return (
    <>
      <Text variant="h3">{task.title}</Text>
      {task.description && (
        <Text variant="body" color="secondary">
          {task.description}
        </Text>
      )}
      <div className="flex justify-between items-center mt-2">
        <Badge variant={task.status === 'completed' ? 'success' : 'warning'}>
          {task.status}
        </Badge>
        <div className="space-x-2">
          <Button size="sm" variant="secondary" onClick={() => onEdit(task)}>
            Edit
          </Button>
          <Button size="sm" variant="danger" onClick={() => onDelete(task.id)}>
            Delete
          </Button>
        </div>
      </div>
    </>
  );
};

export default TaskItem;
