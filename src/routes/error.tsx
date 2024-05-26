import { FlexBox } from "@/components/common/flex-box";
import { Text } from "@/components/common/text";
import { Link } from "react-router-dom";

export default function ErrorPage() {
  //   const error = useRouteError();

  return (
    <FlexBox className="justify-center h-svh">
      <FlexBox id="error-page" className="space-y-4 justify-center flex-col">
        <Text className="text-xl font-semibold">Oops!</Text>
        <Text className="text-md">
          Sorry, an unexpected error has occurred.
        </Text>

        <Link to={"/dashboard"} className="underline text-blue-600">
          Please go back to the dashboard
        </Link>
      </FlexBox>
    </FlexBox>
  );
}
