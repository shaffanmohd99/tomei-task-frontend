"use client";

import {ColumnDef} from "@tanstack/react-table";
import {Task} from "../../../app/task/task";
import {ArrowUpDown} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {TablePopover} from "../TablePopover";

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "id",
    header: ({column}) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <ArrowUpDown className="ml-0.5 h-0.5 w-0.5" />
        </Button>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    id: "actions",
    header: "",
    cell: ({row}) => {
      const task = row.original;

      return <TablePopover task={task} />;
    },
  },
];
