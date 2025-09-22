import {
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
  FaWhatsapp,
  FaFacebook,
  FaQq,
} from "react-icons/fa6";
import { MdLocalPhone, MdEmail } from "react-icons/md";
import { IoLogoWechat } from "react-icons/io5";
import { PiLinkSimpleBold } from "react-icons/pi";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { About as IAbout } from "@/types/brokers";
import { FiInfo } from "react-icons/fi";
import Section from "./Section";

const About = ({ about }: { about: IAbout }) => {
  const details = [
    { label: "Registered Region", value: about.registeredRegion?.[0] },
    { label: "Company Address", value: about.companyAddress?.[0] },
    { label: "Regulatory Status", value: about.regulatoryStatus?.[0] },
    { label: "First Collected", value: about.timeOfFirstCollection?.[0] },
  ].filter((item) => item.value);

  const socials = [
    {
      href: about.instagram?.[0],
      icon: <FaInstagram />,
      hover: "hover:text-red-600",
    },
    {
      href: about.linkedin?.[0],
      icon: <FaLinkedin />,
      hover: "hover:text-blue-800",
    },
    { href: about.x?.[0], icon: <FaXTwitter />, hover: "hover:text-zinc-900" },
    {
      href: about.whatsapp?.[0],
      icon: <FaWhatsapp />,
      hover: "hover:text-green-600",
    },
    {
      href: about.phoneOfTheCompany?.[0],
      icon: <MdLocalPhone />,
      hover: "hover:text-blue-600",
    },
    {
      href: about.customerServiceEmailAddress?.[0],
      icon: <MdEmail />,
      hover: "hover:text-yellow-600",
    },
    {
      href: about.wechat?.[0],
      icon: <IoLogoWechat />,
      hover: "hover:text-green-600",
    },
    { href: about.qq?.[0], icon: <FaQq />, hover: "hover:text-red-600" },
    {
      href: about.facebook?.[0],
      icon: <FaFacebook />,
      hover: "hover:text-blue-600",
    },
  ].filter((item) => item.href);

  return (
    <Section title="About" icon={<FiInfo />}>
      <div className="space-y-6">
        {/* Broker Info Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <button className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full hover:bg-blue-100 transition-all">
              <PiLinkSimpleBold size={18} /> Broker Info
            </button>
          </DialogTrigger>
          <DialogContent className="md:max-w-3xl">
            <DialogHeader>
              <DialogTitle>Broker Information</DialogTitle>
            </DialogHeader>
            <div className="grid md:grid-cols-2 gap-4">
              {about.brokerInformation?.map((info, idx) => (
                <a
                  href={info}
                  rel="noopener noreferrer"
                  target="_blank"
                  key={idx}
                  className="text-blue-700 hover:underline cursor-pointer truncate"
                >
                  {info}
                </a>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Details Section */}
        <div className="flex flex-wrap gap-4">
          {details.map(({ label, value }, idx) => (
            <div
              key={idx}
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 shadow-sm hover:shadow-md transition-all"
            >
              <p className="text-gray-600 text-xs font-semibold">{label}</p>
              <p className="text-gray-800 font-medium">{value}</p>
            </div>
          ))}
        </div>

        {/* Social Media Links */}
        <div className="flex flex-wrap gap-4">
          {socials.map(({ href, icon, hover }, idx) => (
            <a
              key={idx}
              href={href}
              target="_blank"
              rel="noreferrer"
              className={`flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 ${hover} transition-transform transform hover:scale-110`}
            >
              {icon}
            </a>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default About;
