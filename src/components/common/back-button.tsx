import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import Icon from "./icon";
import { Text } from "./text";

type BackBtnProps = {
  route?: string;
};

export const BackBtn = (props: BackBtnProps) => {
  const { route } = props;

  const navigate = useNavigate();

  return (
    <Button
      className="space-x-2"
      size={"sm"}
      onClick={() => (route ? navigate(route) : navigate(-1))}
    >
      <Icon name="arrow-left" />
      <Text className="text-white">Back</Text>
    </Button>
  );
};
