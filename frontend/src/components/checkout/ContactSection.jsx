import { Mail, Phone } from "lucide-react";

const ContactSection = ({ contact, setContact }) => {
  return (
    <section>
      <h2 className="text-sm font-bold tracking-[0.15em] uppercase text-[#171717] mb-5">
        Contact Information
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Email */}
        <div className="relative">
          <Mail
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#999999]"
          />
          <input
            type="email"
            placeholder="Email address"
            value={contact.email}
            onChange={(e) =>
              setContact((prev) => ({ ...prev, email: e.target.value }))
            }
            className="w-full h-12 pl-10 pr-4 border border-[#EAEAEA] rounded-lg bg-white text-sm text-[#171717] placeholder:text-[#AAAAAA] outline-none focus:border-[#171717] transition"
          />
        </div>

        {/* Phone */}
        <div className="relative">
          <Phone
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#999999]"
          />
          <input
            type="tel"
            placeholder="Phone number"
            value={contact.phone}
            onChange={(e) =>
              setContact((prev) => ({ ...prev, phone: e.target.value }))
            }
            className="w-full h-12 pl-10 pr-4 border border-[#EAEAEA] rounded-lg bg-white text-sm text-[#171717] placeholder:text-[#AAAAAA] outline-none focus:border-[#171717] transition"
          />
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

