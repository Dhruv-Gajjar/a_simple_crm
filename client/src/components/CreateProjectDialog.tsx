import { FC } from "react";
import { FormDialog } from "./FormDialog";
import { useGlobalStore } from "@/stores/globalStore";
import { useProjectStore } from "@/stores/projectStore";
import ProjectForm from "./ProjectForm";

const CreateProjectDialog: FC = () => {
  const isOpen = useGlobalStore((state) => state.isProjectDialogOpen);
  const setOpen = useGlobalStore((state) => state.setOpenProjectDialog);
  const isEditMode = useGlobalStore((state) => state.isEditMode);
  const setIsEditMode = useGlobalStore((state) => state.setIsEditMode);
  const setSelectedProjectId = useProjectStore((state) => state.setSelectedProjectId);

  const handleClose = () => {
    if (isEditMode) {
      setIsEditMode();
    }
    setSelectedProjectId("");
    setOpen();
  };

  return (
    <FormDialog
      formId="form-project"
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? "Edit project form" : "Create project form"}
      description={
        isEditMode
          ? "Fill this form to edit the project."
          : "Fill this form to create a new project."
      }
    >
      <ProjectForm />
    </FormDialog>
  );
};

export default CreateProjectDialog;
