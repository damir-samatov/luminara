import {
  ArrowTrendingUpIcon,
  HomeIcon,
  MegaphoneIcon,
  UserGroupIcon,
  UserIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";

export const SIDEBAR_LINKS = [
  {
    href: "/",
    label: "Home",
    icon: <HomeIcon className="h-6 w-6 shrink-0" />,
  },
  {
    href: "/dashboard",
    label: "My Profile",
    icon: <UserIcon className="h-6 w-6 shrink-0" />,
  },
  {
    href: "/dashboard/stream",
    label: "Stream",
    icon: <VideoCameraIcon className="h-6 w-6 shrink-0" />,
  },
];

export const COMING_SOON_LINKS = [
  {
    href: "/dashboard/posts",
    label: "My Posts",
    icon: <MegaphoneIcon className="h-6 w-6 shrink-0" />,
  },
  {
    href: "/dashboard/community",
    label: "Community",
    icon: <UserGroupIcon className="h-6 w-6 shrink-0" />,
  },
  {
    href: "/dashboard/analytics",
    label: "Analytics",
    icon: <ArrowTrendingUpIcon className="h-6 w-6 shrink-0" />,
  },
];
