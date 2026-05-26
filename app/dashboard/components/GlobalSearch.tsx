"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

interface GlobalSearchProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function GlobalSearch({ open, setOpen }: GlobalSearchProps) {
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search for students, exams, settings..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Pages">
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard"))}>
            <Icon icon="ri:dashboard-3-line" className="mr-2 h-4 w-4 text-zinc-400" />
            <span>Overview</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/exams"))}>
            <Icon icon="ri:file-list-3-line" className="mr-2 h-4 w-4 text-zinc-400" />
            <span>Examinations</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/users"))}>
            <Icon icon="ri:group-line" className="mr-2 h-4 w-4 text-zinc-400" />
            <span>Manage Users</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/download"))}>
            <Icon icon="ri:download-cloud-2-line" className="mr-2 h-4 w-4 text-zinc-400" />
            <span>Download App</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/settings"))}>
            <Icon icon="ri:settings-4-line" className="mr-2 h-4 w-4 text-zinc-400" />
            <span>Settings</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Quick Actions (Demo)">
          <CommandItem onSelect={() => runCommand(() => console.log("Create Student"))}>
            <Icon icon="ri:user-add-line" className="mr-2 h-4 w-4 text-zinc-400" />
            <span>Add new student</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => console.log("Create Exam"))}>
            <Icon icon="ri:draft-line" className="mr-2 h-4 w-4 text-zinc-400" />
            <span>Create new examination</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => console.log("Invite Teacher"))}>
            <Icon icon="ri:mail-send-line" className="mr-2 h-4 w-4 text-zinc-400" />
            <span>Invite a teacher</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Recent Entities (Demo)">
          <CommandItem onSelect={() => runCommand(() => console.log("View Student"))}>
            <Icon icon="ri:user-line" className="mr-2 h-4 w-4 text-indigo-400" />
            <span>John Doe</span>
            <span className="ml-auto text-xs text-zinc-500">Student</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => console.log("View Exam"))}>
            <Icon icon="ri:file-paper-2-line" className="mr-2 h-4 w-4 text-indigo-400" />
            <span>Mid-term Mathematics 2026</span>
            <span className="ml-auto text-xs text-zinc-500">Exam</span>
          </CommandItem>
        </CommandGroup>

      </CommandList>
    </CommandDialog>
  );
}
