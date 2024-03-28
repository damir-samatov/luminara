import {
  ArrowTrendingUpIcon,
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
    href: "/posts",
    label: "Posts",
    activeOn: ["/posts"],
    icon: <MegaphoneIcon className="h-6 w-6 shrink-0" />,
  },
  {
    href: "/videos",
    label: "Videos",
    activeOn: ["/videos"],
    icon: <FilmIcon className="h-6 w-6 shrink-0" />,
  },
  {
    href: "/stream",
    label: "Stream",
    activeOn: ["/stream/create", "/stream"],
    icon: <VideoCameraIcon className="h-6 w-6 shrink-0" />,
  },
];

export const COMING_SOON_LINKS = [
  {
    href: "/community",
    label: "Community",
    icon: <UserGroupIcon className="h-6 w-6 shrink-0" />,
  },
  {
    href: "/analytics",
    label: "Analytics",
    icon: <ArrowTrendingUpIcon className="h-6 w-6 shrink-0" />,
  },
];
