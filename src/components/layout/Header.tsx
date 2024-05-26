import { useLocation } from "react-router-dom";
import { FlexBox } from "../common/flex-box";
import { Text } from "../common/text";

export const Header = () => {
  const location = useLocation();
  const title = location.pathname.slice(1).split("/")[0];

  return (
    <header className="h-20 px-6 py-4 border-b border-b-gray-200">
      <FlexBox className="h-full w-full justify-between">
        <Text className="text-md font-medium capitalize">{title}</Text>

        <FlexBox className="gap-2">
          <div>test</div>
          <div>nice</div>
        </FlexBox>
      </FlexBox>
    </header>
  );
};
