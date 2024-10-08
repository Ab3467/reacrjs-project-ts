import React, { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import Modal from "./modal";
import { Button } from "./ui/button";
import { DayPicker, DayPickerProps } from "react-day-picker";
import "react-day-picker/dist/style.css";

type NewProjectProps = {
  onAdd: (projectData: {
    title: string;
    description: string;
    duedate: string;
  }) => void;
  onCancel: () => void;
};

const NewProject: React.FC<NewProjectProps> = ({ onAdd, onCancel }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");

  function handleSaveButton(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const titleInput = form.querySelector<HTMLInputElement>('input[name="title"]');
    const descriptionInput = form.querySelector<HTMLTextAreaElement>('textarea[name="description"]');

    if(!titleInput || !descriptionInput){
      alert("no element found");
      return;
    }

    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();

    if (title === "" || description === "" || selectedDate.trim() === "") {
      setIsModalOpen(true);
      return;
    }

    onAdd({
      title,
      description,
      duedate: selectedDate,
    });

    form.reset();
    setSelectedDate("");
  }

  function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const dayPickerInitialProps: DayPickerProps = {
    mode: "single",
    selected: selectedDate ? new Date(selectedDate) : undefined,
    onSelect: (date: Date | undefined) => {
      if (date) {
        setSelectedDate(formatDate(date));
      } else {
        setSelectedDate("");
      }
    },
  };

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Enter") {
        const form = document.querySelector("form");
        if (form) {
          const titleInput = form.querySelector<HTMLInputElement>('input[name="title"]');
          const descriptionInput = form.querySelector<HTMLTextAreaElement>('textarea[name="description"]');
          const title = titleInput?.value.trim() || "";
          const description = descriptionInput?.value.trim() || "";
          if (title && description && selectedDate) {
            handleSaveButton({ currentTarget: form, preventDefault: () => {} } as React.FormEvent<HTMLFormElement>);
          }
        }
      }
    }
  
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedDate]); // This line has missing dependency
  
  return (
    <>
      <Modal
        btnCaption="Ok"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Invalid Input"
        message="Oops... Looks like you forgot to enter a value. Please make sure you provided a valid value for every input field."
      />
      <form className="w-[35rem] mt-16" onSubmit={handleSaveButton}>
        <div className="flex items-center justify-end gap-4 my-4">
          <Button
            className="text-stone-800 hover:text-stone-950"
            onClick={onCancel}
            type="button"
            variant="ghost"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="px-6 py-2 rounded-md bg-stone-800 text-stone-50 hover:bg-stone-950"
            variant="default"
          >
            Save
          </Button>
        </div>
        <div>
          <div className="mb-4">
            <label htmlFor="title" className="block mb-1 text-stone-500 font-bold">
              Title
            </label>
            <Input
              type="text"
              id="title"
              name="title"
              placeholder="Enter the title"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block mb-1 text-stone-500 font-bold">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter the description"
              rows={4}
              className="resize-none"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="dueDate" className="block mb-1 text-stone-500 font-bold">
              Due Date
            </label>
            <DayPicker {...dayPickerInitialProps} />
          </div>
        </div>
      </form>
    </>
  );
};

export default NewProject;
