"use client";
import {DataTable} from "../components/reuseable/data-table/data-table";
import {columns} from "../components/reuseable/data-table/columns";
import {CreateTaskDialog} from "../components/reuseable/CreateTaskDialog";
import {useQuery} from "@tanstack/react-query";
import {fetchTasks} from "./api/task";
import {Status, StatusCombobox} from "@/components/reuseable/StatusCombobox";
import {useState} from "react";
import {TaskStatus} from "./task/task";

export default function Home() {
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);

  const {data: tasks = [], isLoading} = useQuery({
    queryKey: ["tasks", selectedStatus?.value],
    queryFn: () => fetchTasks(selectedStatus?.value as TaskStatus),
  });
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full  flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex justify-center w-full flex-col">
          <div className="mb-5 flex w-full justify-between">
            <StatusCombobox
              value={selectedStatus}
              onChange={setSelectedStatus}
            />
            <CreateTaskDialog mode="create" />
          </div>
          <DataTable columns={columns} data={tasks} />
        </div>
      </main>
    </div>
  );
}
