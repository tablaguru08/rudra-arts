import { useEffect } from "react";
import { FaEnvelope, FaGlobe, FaPhone } from "react-icons/fa";
import AnimatedUnderline from "../AnimatedUnderline/AnimatedUnderline";

const termsSections = [
  {
    title: "1. Company Information",
    content: [
      {
        type: "details",
        items: [
          { label: "Legal Name", value: "Rudra Arts and Handicrafts LLP" },
          {
            label: "Website",
            value: "https://www.rudraartsandhandicrafts.in/",
            href: "https://www.rudraartsandhandicrafts.in/",
          },
          {
            label: "Email",
            value: "rudra.arts30@gmail.com",
            href: "mailto:rudra.arts30@gmail.com",
          },
          {
            label: "Phone",
            value: "+91 7028996666",
            href: "tel:+917028996666",
          },
        ],
      },
    ],
  },
  {
    title: "2. Eligibility",
    intro: "By using this website, you confirm that:",
    content: [
      {
        type: "list",
        items: [
          "You are at least 18 years of age or accessing the website under the supervision of a parent or legal guardian.",
          "The information provided by you is accurate and complete.",
          "You will use this website only for lawful purposes.",
        ],
      },
    ],
  },
  {
    title: "3. Products & Services",
    content: [
      {
        type: "list",
        items: [
          "All products displayed on this website are subject to availability.",
          "As many of our products are handcrafted, slight variations in color, texture, size, finish, or design may occur. Such variations are natural characteristics of handmade products and should not be considered defects.",
          "Product images are for illustrative purposes only. Actual products may vary slightly due to photography, lighting, or display settings.",
        ],
      },
    ],
  },
  {
    title: "4. Pricing",
    content: [
      {
        type: "list",
        items: [
          "All prices displayed on the website are in Indian Rupees (INR).",
          "Applicable taxes, shipping charges, and other fees (if any) will be calculated and displayed during checkout.",
          "We reserve the right to modify prices without prior notice.",
        ],
      },
    ],
  },
  {
    title: "5. Orders & Acceptance",
    content: [
      {
        type: "list",
        items: [
          "An order is considered confirmed only after successful payment and receipt of an order confirmation from Rudra Arts and Handicrafts LLP.",
          {
            text: "We reserve the right to refuse or cancel any order due to:",
            children: [
              "Product unavailability",
              "Incorrect pricing",
              "Incomplete customer information",
              "Payment authorization failure",
              "Suspected fraudulent or unauthorized activity",
            ],
          },
        ],
      },
      {
        type: "paragraph",
        text: "If payment has already been made for a cancelled order, the refund will be processed as per our Refund & Cancellation Policy.",
      },
    ],
  },
  {
    title: "6. Payments",
    content: [
      {
        type: "paragraph",
        text: "We accept secure online payments through authorized payment gateway providers.",
      },
      {
        type: "paragraph",
        text: "All payment transactions are processed using industry-standard encryption through secure payment gateways. Rudra Arts and Handicrafts LLP does not store your debit card, credit card, UPI PIN, CVV, or banking credentials.",
      },
    ],
  },
  {
    title: "7. Shipping & Delivery",
    content: [
      {
        type: "list",
        items: [
          "Orders are processed and dispatched within the timelines mentioned on the respective product pages.",
          "Delivery timelines may vary depending on your location, courier partner availability, weather conditions, or other unforeseen circumstances.",
          "Any delay caused by courier partners, natural disasters, government restrictions, or force majeure events shall not make Rudra Arts and Handicrafts LLP liable for compensation.",
        ],
      },
    ],
  },
  {
    title: "8. Cancellation, Returns & Refunds",
    content: [
      {
        type: "paragraph",
        text: "Cancellation, return, replacement, and refund requests are governed by our Refund & Cancellation Policy, available on this website.",
      },
    ],
  },
  {
    title: "9. Intellectual Property",
    intro: "All content available on this website, including but not limited to:",
    content: [
      {
        type: "list",
        items: [
          "Product photographs",
          "Images",
          "Logos",
          "Graphics",
          "Text",
          "Designs",
          "Icons",
          "Website layout",
          "Branding",
        ],
      },
      {
        type: "paragraph",
        text: "is the exclusive property of Rudra Arts and Handicrafts LLP and is protected under applicable intellectual property laws.",
      },
      {
        type: "paragraph",
        text: "No material from this website may be copied, reproduced, distributed, modified, or used without prior written permission.",
      },
    ],
  },
  {
    title: "10. User Conduct",
    intro: "You agree not to:",
    content: [
      {
        type: "list",
        items: [
          "Use the website for any unlawful or fraudulent purpose.",
          "Provide false or misleading information.",
          "Attempt unauthorized access to our systems or servers.",
          "Introduce viruses, malware, or harmful software.",
          "Interfere with the proper functioning of the website.",
        ],
      },
    ],
  },
  {
    title: "11. Limitation of Liability",
    content: [
      {
        type: "paragraph",
        text: "To the maximum extent permitted by law, Rudra Arts and Handicrafts LLP shall not be liable for any indirect, incidental, consequential, special, or punitive damages arising from the use of this website or any products purchased through it.",
      },
      {
        type: "paragraph",
        text: "Our total liability, if any, shall not exceed the value of the product purchased by the customer.",
      },
    ],
  },
  {
    title: "12. Privacy",
    content: [
      {
        type: "paragraph",
        text: "Your personal information is collected, stored, and processed in accordance with our Privacy Policy.",
      },
    ],
  },
  {
    title: "13. Changes to Terms",
    content: [
      {
        type: "paragraph",
        text: "Rudra Arts and Handicrafts LLP reserves the right to modify these Terms & Conditions at any time without prior notice.",
      },
      {
        type: "paragraph",
        text: "Any changes become effective immediately upon publication on this website. Continued use of the website constitutes your acceptance of the revised Terms.",
      },
    ],
  },
  {
    title: "14. Governing Law",
    content: [
      {
        type: "paragraph",
        text: "These Terms & Conditions shall be governed by and interpreted in accordance with the laws of India.",
      },
      {
        type: "paragraph",
        text: "Any disputes arising from the use of this website or any transactions conducted through it shall be subject to the exclusive jurisdiction of the competent courts having jurisdiction over the registered office of Rudra Arts and Handicrafts LLP.",
      },
    ],
  },
];

const contactLinks = [
  {
    icon: FaGlobe,
    label: "Website",
    value: "https://www.rudraartsandhandicrafts.in/",
    href: "https://www.rudraartsandhandicrafts.in/",
  },
  {
    icon: FaEnvelope,
    label: "Email",
    value: "rudra.arts30@gmail.com",
    href: "mailto:rudra.arts30@gmail.com",
  },
  {
    icon: FaPhone,
    label: "Phone",
    value: "+91 7028996666",
    href: "tel:+917028996666",
  },
];

const renderListItem = (item) => {
  if (typeof item === "string") {
    return <span>{item}</span>;
  }

  return (
    <>
      <span>{item.text}</span>
      <ul className="mt-3 space-y-2 pl-5">
        {item.children.map((child) => (
          <li key={child} className="list-disc text-gray-700">
            {child}
          </li>
        ))}
      </ul>
    </>
  );
};

const renderBlock = (block) => {
  if (block.type === "paragraph") {
    return (
      <p key={block.text} className="text-base leading-7 text-gray-700">
        {block.text}
      </p>
    );
  }

  if (block.type === "list") {
    return (
      <ul key={block.items.length} className="space-y-3 pl-5">
        {block.items.map((item) => {
          const key = typeof item === "string" ? item : item.text;

          return (
            <li key={key} className="list-disc text-base leading-7 text-gray-700">
              {renderListItem(item)}
            </li>
          );
        })}
      </ul>
    );
  }

  if (block.type === "details") {
    return (
      <dl key="details" className="grid gap-4 sm:grid-cols-2">
        {block.items.map((item) => (
          <div key={item.label} className="rounded-lg border border-amber-100 bg-amber-50 p-4">
            <dt className="text-sm font-semibold uppercase tracking-wide text-customBrown">
              {item.label}
            </dt>
            <dd className="mt-1 text-gray-800">
              {item.href ? (
                <a href={item.href} className="break-words hover:text-orange-600">
                  {item.value}
                </a>
              ) : (
                item.value
              )}
            </dd>
          </div>
        ))}
      </dl>
    );
  }

  return null;
};

const TermsAndCondition = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 px-4 py-20 font-times sm:px-6">
      <section className="mx-auto mt-20 max-w-5xl">
        <div className="mb-12 text-center">
          <h1 className="mb-5 text-4xl font-normal text-customBrown md:text-5xl">
            <AnimatedUnderline>Terms & Conditions</AnimatedUnderline>
          </h1>
          <p className="text-base text-amber-900">Last Updated: 25/06/2026</p>
        </div>

        <article className="rounded-lg border border-amber-200 bg-white p-5 shadow-lg sm:p-8 md:p-10">
          <p className="mb-8 text-lg leading-8 text-gray-700">
            Welcome to <strong>Rudra Arts and Handicrafts LLP</strong> (&quot;Company&quot;,
            &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). These Terms & Conditions govern
            your use of our website, products, and services. By accessing or using
            our website, you agree to comply with and be bound by these Terms &
            Conditions. If you do not agree with any part of these Terms, please
            refrain from using our website.
          </p>

          <div className="space-y-9">
            {termsSections.map((section) => (
              <section key={section.title} className="border-t border-amber-100 pt-7">
                <h2 className="mb-4 text-2xl font-normal text-customBrown">
                  {section.title}
                </h2>
                {section.intro && (
                  <p className="mb-4 text-base leading-7 text-gray-700">
                    {section.intro}
                  </p>
                )}
                <div className="space-y-4">
                  {section.content.map((block, index) => (
                    <div key={`${section.title}-${index}`}>{renderBlock(block)}</div>
                  ))}
                </div>
              </section>
            ))}

            <section className="border-t border-amber-100 pt-7">
              <h2 className="mb-4 text-2xl font-normal text-customBrown">
                15. Contact Us
              </h2>
              <p className="mb-5 text-base leading-7 text-gray-700">
                For any questions regarding these Terms & Conditions, please contact
                us:
              </p>
              <div className="rounded-lg bg-amber-50 p-5">
                <p className="mb-5 text-lg font-semibold text-gray-900">
                  Rudra Arts and Handicrafts LLP
                </p>
                <div className="grid gap-4 md:grid-cols-3">
                  {contactLinks.map((item) => {
                    const Icon = item.icon;

                    return (
                      <a
                        key={item.label}
                        href={item.href}
                        className="flex items-start gap-3 rounded-lg border border-amber-100 bg-white p-4 text-gray-700 transition hover:border-orange-300 hover:text-orange-600"
                      >
                        <Icon className="mt-1 shrink-0 text-customBrown" />
                        <span>
                          <span className="block text-sm font-semibold text-customBrown">
                            {item.label}
                          </span>
                          <span className="break-words">{item.value}</span>
                        </span>
                      </a>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>
        </article>
      </section>
    </main>
  );
};

export default TermsAndCondition;
