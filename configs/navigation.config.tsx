import {
  ArrowTrendingUpIcon,
  Cog6ToothIcon,
  HomeIcon,
  MegaphoneIcon,
  NewspaperIcon,
  UserGroupIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";

export const SIDEBAR_LINKS = [
  {
    href: "/",
    label: "Home",
    icon: <HomeIcon className="h-6 w-6 shrink-0" />,
  },
  {
    href: "/subscriptions",
    label: "Subscriptions",
    icon: <NewspaperIcon className="h-6 w-6 shrink-0" />,
  },
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: <Cog6ToothIcon className="h-6 w-6 shrink-0" />,
  },
  {
    href: "/dashboard/posts",
    label: "Posts",
    icon: <MegaphoneIcon className="h-6 w-6 shrink-0" />,
  },
  {
    href: "/dashboard/stream",
    label: "Stream",
    icon: <VideoCameraIcon className="h-6 w-6 shrink-0" />,
  },
];

export const COMING_SOON_LINKS = [
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
