import {
  FilmIcon,
  HomeIcon,
  MegaphoneIcon,
  NewspaperIcon,
  SignalIcon,
  TicketIcon,
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
];

export const STUDIO_LINKS = [
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
    icon: <SignalIcon className="h-6 w-6 shrink-0" />,
  },
  {
    href: "/subscription-plans",
    label: "Subscription Plans",
    activeOn: ["/subscription-plans"],
    icon: <TicketIcon className="h-6 w-6 shrink-0" />,
  },
];
