import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {NativeSelect, NativeSelectOption} from "@/components/ui/native-select";
import {zodResolver} from "@hookform/resolvers/zod";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useState} from "react";
import {Controller, useForm} from "react-hook-form";
import * as z from "zod";
import {createTask, updateTask} from "../../app/api/task";
import {Spinner} from "@/components/ui/spinner";
import {Task} from "@/app/task/task";

type TaskFormMode = "create" | "edit";

type CreateTaskDialogProps = {
  mode: TaskFormMode;
  task?: Task;
  onClosePopover?: () => void;
};

const formSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters.")
    .max(32, "Title must be at most 32 characters."),
  description: z.string(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
});
export function CreateTaskDialog({
  mode = "create",
  task,
  onClosePopover,
}: CreateTaskDialogProps) {
  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      setOpen(false);
      form.reset();
      queryClient.invalidateQueries({queryKey: ["tasks"]});
    },
  });
  const editMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      setOpen(false);
      onClosePopover?.();
      form.reset();
      queryClient.invalidateQueries({queryKey: ["tasks"]});
    },
  });

  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
      status: task?.status ?? "TODO",
    },
  });
  function onSubmit(data: z.infer<typeof formSchema>) {
    mode === "edit"
      ? editMutation.mutate({id: task!.id, data})
      : createMutation.mutate(data);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{mode === "edit" ? "Edit task" : "Create new task"}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit task" : "Create new task"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            {mode === "edit" && (
              <>
                <Label>ID</Label>
                <Input defaultValue={task!.id} disabled />
              </>
            )}

            <Controller
              name="title"
              control={form.control}
              render={({field, fieldState}) => (
                <div className="grid">
                  <Label className="mb-3">Title</Label>
                  <Input {...field} aria-invalid={fieldState.invalid} />
                  {fieldState.error && (
                    <p className="text-sm text-red-500">
                      {fieldState.error?.message}
                    </p>
                  )}
                </div>
              )}
            />
            <Controller
              name="description"
              control={form.control}
              render={({field, fieldState}) => (
                <div className="grid ">
                  <Label className="mb-3">Description</Label>
                  <Input {...field} aria-invalid={fieldState.invalid} />
                  {fieldState.error && (
                    <p className="text-sm text-red-500">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
            <Controller
              name="status"
              control={form.control}
              render={({field}) => (
                <div className="grid gap-2">
                  <Label>Status</Label>
                  <NativeSelect {...field}>
                    <NativeSelectOption value="TODO">Todo</NativeSelectOption>
                    <NativeSelectOption value="IN_PROGRESS">
                      In Progress
                    </NativeSelectOption>
                    <NativeSelectOption value="DONE">Done</NativeSelectOption>
                  </NativeSelect>
                </div>
              )}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={() => form.reset()}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">
              {(createMutation.isPending || editMutation.isPending) && (
                <Spinner />
              )}
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
