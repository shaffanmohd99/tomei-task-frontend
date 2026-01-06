import {Task} from "@/app/task/task";
import {Button} from "../ui/button";
import {Popover, PopoverContent, PopoverTrigger} from "../ui/popover";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {CreateTaskDialog} from "./CreateTaskDialog";
import {useState} from "react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {deleteTask} from "@/app/api/task";
import {Spinner} from "../ui/spinner";
type TablePopoverProps = {
  task: Task;
};
export function TablePopover({task}: TablePopoverProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      setOpen(false);
      queryClient.invalidateQueries({queryKey: ["tasks"]});
    },
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm">
          •••
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-32">
        <div className="flex flex-col gap-2">
          <CreateTaskDialog
            mode="edit"
            task={task}
            onClosePopover={() => setOpen(false)}
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-106.25">
              <DialogHeader>
                <DialogTitle>{`Delete Task with ID ${task.id}`}</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                Are you sure you want to delete this task?
              </DialogDescription>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button
                  variant="destructive"
                  onClick={() =>
                    task.status !== "DONE" && deleteMutation.mutate(task.id)
                  }
                >
                  {deleteMutation.isPending && <Spinner />}
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </PopoverContent>
    </Popover>
  );
}
