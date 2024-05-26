import { cn } from "@/lib/utils";
import { useLocation, useNavigate } from "react-router-dom";
import { FlexBox } from "../common/flex-box";
import Icon, { IconName } from "../common/icon";
import { Text } from "../common/text";

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="w-full space-y-1 p-4">
      {layouts.map(({ label, icon, url }) => (
        <FlexBox
          key={label + "layout navigation lists"}
          className={cn(
            "px-4 py-3 gap-4 w-full hover:bg-gray-200 cursor-pointer rounded-md",
            location.pathname.startsWith(url) ? "bg-gray-200" : ""
          )}
          onClick={() => navigate(url)}
        >
          <Icon name={icon} size={20} className="text-gray-700" />
          <Text className="text-md font-medium">{label}</Text>
        </FlexBox>
      ))}
    </nav>
  );
};

const layouts: { label: string; url: string; icon: IconName }[] = [
  { label: "Dashboard", icon: "book-user", url: "/dashboard" },
  { label: "Subjects", icon: "school", url: "/subjects" },
  { label: "Students", icon: "user", url: "/students" },
  // { label: "Settings", icon: "settings", url: "/settings" },
];
