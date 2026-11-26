import { Priority, Status, useCreateTaskMutation } from "@/state/api";
import { formatISO } from "date-fns";
import React, { useState } from "react";
import Modal from "../modal";

type Props = {
  id?: string | null;
  toStatus?: Status | null;
  isOpen: boolean;
  onClose: () => void;
};

const INPUT_STYLES =
  "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

const SELECT_STYLES =
  "mb-4 block w-full rounded border border-gray-300 px-3 py-2 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

const ModalNewTask = ({
  id = null,
  isOpen,
  onClose,
  toStatus = null,
}: Props) => {
  const [createTask, { isLoading }] = useCreateTaskMutation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [tags, setTags] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [authorUserId, setAuthorUserId] = useState("");
  const [assignedUserId, setAssignedUserId] = useState("");
  const [projectId, setProjectId] = useState("");

  const handleSubmit = async () => {
    if (!isFormValid() || isLoading) {
      return;
    }

    const formattedStartDate = formatISO(new Date(startDate), {
      representation: "complete",
    });

    const formattedDueDate = formatISO(new Date(dueDate), {
      representation: "complete",
    });

    try {
      await createTask({
        title: title.trim(),
        description: description.trim(),
        status: toStatus ?? Status[status as keyof typeof Status],
        priority: Priority[priority as keyof typeof Priority],
        tags: tags.trim(),
        startDate: formattedStartDate,
        dueDate: formattedDueDate,
        authorUserId: parseInt(authorUserId.trim()),
        assignedUserId: parseInt(assignedUserId.trim()),
        projectId: id ? Number(id) : parseInt(projectId),
      }).unwrap();

      onClose();
    } catch (error: any) {
      console.error(`Failed to create a task: ${error.message}`);
    }
  };

  const isFormValid = () => {
    return (
      (id || projectId) &&
      title.trim() &&
      (status || toStatus) &&
      priority &&
      startDate &&
      dueDate &&
      authorUserId.trim()
    );
  };

  return (
    <Modal
      name={`Create New Task ${toStatus ? `(${toStatus})` : ""}`}
      isOpen={isOpen}
      onClose={onClose}
    >
      <form
        className="mt-4 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <input
          type="text"
          className={INPUT_STYLES}
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className={INPUT_STYLES}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          {!toStatus && (
            <select
              className={SELECT_STYLES}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Select Status</option>
              {Object.entries(Status).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          )}
          <select
            className={SELECT_STYLES}
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="">Select Priority</option>
            {Object.entries(Priority).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <input
          type="text"
          className={INPUT_STYLES}
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <input
            type="date"
            className={INPUT_STYLES}
            placeholder="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className={INPUT_STYLES}
            placeholder="Due Date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <input
          type="text"
          className={INPUT_STYLES}
          placeholder="Author User ID"
          value={authorUserId}
          onChange={(e) => setAuthorUserId(e.target.value)}
        />
        {!id && (
          <input
            type="text"
            className={INPUT_STYLES}
            placeholder="Project ID"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          />
        )}
        <input
          type="text"
          className={INPUT_STYLES}
          placeholder="Assigned User ID"
          value={assignedUserId}
          onChange={(e) => setAssignedUserId(e.target.value)}
        />
        <button
          type="submit"
          disabled={!isFormValid() || isLoading}
          className={`mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
            !isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
          {isLoading ? "Creating..." : "Create Task"}
        </button>
      </form>
    </Modal>
  );
};

export default ModalNewTask;
