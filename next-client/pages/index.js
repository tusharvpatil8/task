import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-indigo-700">
          Welcome to <span className="text-blue-500">TaskManager</span>
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Organize your tasks, read insightful blogs, and stay productive with
          our interactive platform 🚀
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 flex gap-4"
      >
        <Link
          href="/task" 
          className="px-6 py-3 bg-indigo-600 text-white rounded-2xl shadow-lg hover:bg-indigo-700 transition flex items-center gap-2"
        >
          Get Started <ArrowRight size={18} />
        </Link>
        <Link
          href="/task" 
          className="px-6 py-3 bg-white border border-indigo-300 rounded-2xl shadow-lg hover:bg-indigo-50 transition"
        >
          Explore Tasks
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-16 grid md:grid-cols-3 gap-8 max-w-5xl"
      >
        {[
          {
            title: "Smart Tasking",
            desc: "Easily add, track, and manage your tasks in one place.",
          },
          {
            title: "Insightful Tasks",
            desc: "Read tasks that boost your productivity & learning.",
          },
          {
            title: "Seamless Experience",
            desc: "Fast, responsive, and user-friendly design for everyone.",
          },
        ].map((feature, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-white rounded-2xl shadow-xl border border-gray-100"
          >
            <CheckCircle className="text-green-500 mb-3" size={28} />
            <h3 className="text-xl font-semibold text-indigo-700">
              {feature.title}
            </h3>
            <p className="text-gray-600 mt-2">{feature.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Home;