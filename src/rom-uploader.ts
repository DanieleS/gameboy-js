import { addEventListeners } from "./utils/dom";

function disableDragAndDropEventsPropagation(root: HTMLElement) {
  const eventDisabler = (e: Event) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const events = [
    "drag",
    "dragstart",
    "dragend",
    "dragover",
    "dragenter",
    "dragleave",
    "drop",
  ] as const;

  addEventListeners(root, events, eventDisabler);
}

export function createRomUploader(
  root: HTMLElement,
  fileInput: HTMLInputElement,
  onUpload: (files: File) => void
) {
  disableDragAndDropEventsPropagation(root);

  const dragOver = (e: DragEvent) => {
    root.classList.add("drag-over");
  };

  const dragLeave = (e: DragEvent) => {
    root.classList.remove("drag-over");
  };

  const uploadHandler = (files: FileList | null | undefined) => {
    if (files && files.length == 1 && files[0].name.endsWith(".gb")) {
      onUpload(files[0]);
    } else {
      alert("Please select a .gb file");
    }
  };

  addEventListeners(root, ["dragover", "dragenter"], dragOver);
  addEventListeners(root, ["dragleave", "dragend", "drop"], dragLeave);
  addEventListeners(root, ["drop"], (e) =>
    uploadHandler(e.dataTransfer?.files)
  );
  addEventListeners(fileInput, ["change"], (e) =>
    uploadHandler(fileInput.files)
  );
}
