import { PlusIcon } from "lucide-react";
import { Button } from "./ui/button";

interface AddButtonProps {
  title: string;
  onClick?: () => void;
}

export const AddButton = ({ title, onClick }: AddButtonProps) => {
  return (
    <Button size="sm" onClick={onClick}>
      <PlusIcon />
      {title}
    </Button>
  );
};
