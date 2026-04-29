"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { AtSign, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-black/30 backdrop-blur-md">
      {/* CTA banner */}
      <div className="border-b border-white/10 px-6 py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-xl"
        >
          <h3 className="mb-4 text-3xl font-black text-white">
            Ready to map your mind?
          </h3>
          <Link href="/space">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="rounded-full px-8 py-3 text-base font-bold text-white"
              style={{
                background: "linear-gradient(135deg, #7a00ff 0%, #00f0ff 100%)",
                boxShadow: "0 0 30px rgba(122,0,255,0.4)",
              }}
            >
              Enter Thought Space →
            </motion.button>
          </Link>
        </motion.div>
      </div>

      {/* Footer bottom */}
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <div className="text-center md:text-left">
            <div
              className="mb-1 text-xl font-black"
              style={{
                background: "linear-gradient(90deg, #00f0ff, #7a00ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Neural Thought Space
            </div>
            <p className="text-sm text-white/40">
              Developed by{" "}
              <span className="font-semibold text-white/70">Jayaprakash</span>
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 md:items-end">
            <a
              href="mailto:deyjayprakash1232gmail.com"
              className="flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-[#00f0ff]"
            >
              <Mail size={14} />
              deyjayprakash1232gmail.com
            </a>
            <a
              href="https://instagram.com/jayy__hx"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-[#ff00c8]"
            >
              <AtSign size={14} />
              @jayy__hx
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-white/5 pt-6 text-center text-xs text-white/20">
          © {new Date().getFullYear()} Neural Thought Space. Built with Next.js &amp; React Flow.
        </div>
      </div>
    </footer>
  );
}
