import {
  ArrowTrendingUpIcon,
  Cog6ToothIcon,
  FilmIcon,
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
    activeOn: ["/"],
    icon: <HomeIcon className="h-6 w-6 shrink-0" />,
  },
  {
    href: "/subscriptions",
    label: "Subscriptions",
    activeOn: ["/subscriptions"],
    icon: <NewspaperIcon className="h-6 w-6 shrink-0" />,
  },
  {
    href: "/dashboard",
    label: "Dashboard",
    activeOn: ["/dashboard"],
    icon: <Cog6ToothIcon className="h-6 w-6 shrink-0" />,
  },
  {
    href: "/dashboard/posts",
    label: "Posts",
    activeOn: ["/dashboard/posts"],
    icon: <MegaphoneIcon className="h-6 w-6 shrink-0" />,
  },
  {
    href: "/dashboard/videos",
    label: "Videos",
    activeOn: ["/dashboard/videos"],
    icon: <FilmIcon className="h-6 w-6 shrink-0" />,
  },
  {
    href: "/dashboard/stream",
    label: "Stream",
    activeOn: ["/dashboard/stream/create", "/dashboard/stream"],
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
