import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import Icon from "./icon";
import { Text } from "./text";

export const BackBtn = () => {
  const navigate = useNavigate();

  return (
    <Button className="space-x-2" size={"sm"} onClick={() => navigate(-1)}>
      <Icon name="arrow-left" />
      <Text className="text-white">Back</Text>
    </Button>
  );
};
