import { Bolt } from "lucide-react";
import { ShoppingBag } from "lucide-react";
import { BellDot } from "lucide-react";
import { BookOpenText } from "lucide-react";
import { BriefcaseBusiness } from "lucide-react";
import { CircleHelp } from "lucide-react";
import { TriangleAlert } from "lucide-react";
import { Users } from "lucide-react";
import { Lock } from "lucide-react";
import { Dessert } from "lucide-react";
import { ShieldPlus } from "lucide-react";
import { MessageCircle } from "lucide-react";
import { Images } from "lucide-react";
import { Figma } from "lucide-react";
import { Play } from "lucide-react";
import { MapPin } from "lucide-react";
import { Database } from "lucide-react";
import { PanelsTopLeft } from "lucide-react";
import { PanelTop } from "lucide-react";

export const Menus = [
  {
    name: "Woman",
    subMenuHeading: ["Polofit", "Printed"],
    subMenu: [
      {
        name: "T-Shit",
        desc: "Responsive design",
        icon: PanelsTopLeft,
      },
      {
        name: "T-Shit",
        desc: "Site control",
        icon: Bolt,
      },
      {
        name: "T-Shit",
        desc: "Link pages",
        icon: PanelTop,
      },
      {
        name: "T-Shit",
        desc: "Management content",
        icon: Database,
      },
    ],
    gridCols: 2,
  },
  {
    name: "Mens",
    subMenuHeading: ["Get started", "Programs", "Recent"],
    subMenu: [
      {
        name: "T-Shit",
        desc: "Browse templates",
        icon: ShoppingBag,
      },
      {
        name: "T-Shit",
        desc: "Upcoming events",
        icon: MapPin,
      },
      {
        name: "T-Shit",
        desc: "Changelog",
        icon: BellDot,
      },
      {
        name: "T-Shit",
        desc: "Watch lessions",
        icon: Play,
      },
      {
        name: "T-Shit",
        desc: "Posts",
        icon: BookOpenText,
      },
      {
        name: "T-Shit",
        desc: "Plugin",
        icon: Figma,
      },
      {
        name: "T-Shit",
        desc: "Jobs",
        icon: BriefcaseBusiness,
      },
      {
        name: "T-Shit",
        desc: "Images",
        icon: Images,
      },
    ],
    gridCols: 3,
  },
  {
    name: "Support",
    subMenu: [
      {
        name: "T-Shit",
        desc: "Center",
        icon: CircleHelp,
      },
      {
        name: "T-Shit",
        desc: "Project help",
        icon: MessageCircle,
      },
      {
        name: "T-Shit",
        desc: "Urgent issues",
        icon: TriangleAlert,
      },
    ],
    gridCols: 1,
  },
  {
    name: "Enterprise",
    subMenuHeading: ["Overview", "Features"],
    subMenu: [
      {
        name: "T-Shit",
        desc: "Overview",
        icon: ShieldPlus,
      },
      {
        name: "T-Shit",
        desc: "Design together",
        icon: Users,
      },
      {
        name: "T-Shit",
        desc: "Stories",
        icon: Dessert,
      },
      {
        name: "T-Shit",
        desc: "Your site secured",
        icon: Lock,
      },
    ],
    gridCols: 2,
  },
  {
    name: "Pricing",
  },
  {
    name: "Contact",
  },
];
