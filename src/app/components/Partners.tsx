"use client";

import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { DOMAIN } from "@/src/env";

type Partner = {
  id: number;
  imageUrl?: string;
};

type PublicPartnersResponse = {
  success?: boolean;
  data?: Partner[];
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

// function resolveImageUrl(imageUrl?: string) {
//   if (!imageUrl) {
//     return null;
//   }

//   if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
//     return imageUrl;
//   }

//   return `${DOMAIN}${imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`}`;
// }

export default function Partners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchPartners = async () => {
      try {
        setIsLoading(true);

        const res = await fetch(`${DOMAIN}/api/public/partners`, {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }

        const json = (await res.json()) as PublicPartnersResponse;

        if (json.success && Array.isArray(json.data)) {
          setPartners(json.data);
        } else {
          setPartners([]);
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        console.error("Failed to fetch partners:", error);
        setPartners([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartners();

    return () => controller.abort();
  }, []);

  return (
    <section
      id="partners"
      className="relative overflow-hidden px-6 py-20 text-slate-900"
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
        className="relative mx-auto max-w-6xl"
      >
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
            Trusted Network
          </p>
          <h2 className="mt-3 font-(--font-space) text-3xl text-slate-900 sm:text-4xl md:text-5xl">
            Our <span className="text-blue-700">Partners</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            We collaborate with companies and organizations that help shape a
            more practical learning experience.
          </p>
        </div>

        <div className="home-surface mt-10 rounded-4xl p-6 md:p-8">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={`partner-skeleton-${index}`}
                  className="h-28 animate-pulse rounded-2xl border border-blue-200/70 bg-linear-to-br from-blue-50/70 to-white"
                />
              ))}
            </div>
          ) : partners.length === 0 ? (
            <p className="py-8 text-center text-slate-500">
              No partners available right now.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {partners.map((partner) => {
                const imageSrc = partner.imageUrl;

                return (
                  <div
                    key={partner.id}
                    className="flex h-28 items-center justify-center rounded-2xl border border-blue-200/70 bg-linear-to-br from-white via-blue-50/65 to-white p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-300/80 hover:shadow-md"
                  >
                    {imageSrc ? (
                      <Image
                        src={imageSrc}
                        alt="Partner logo"
                        width={160}
                        height={72}
                        className="max-h-16 w-auto max-w-full object-contain grayscale transition duration-200 hover:grayscale-0"
                      />
                    ) : (
                      <span className="text-sm font-medium text-slate-400">
                        Partner
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
