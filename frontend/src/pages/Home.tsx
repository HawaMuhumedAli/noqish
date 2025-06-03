import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import HeroImage from "../assets/hero.png";
import AboutImage from "../assets/about.png";
import {
  User,
  UserRound,
  Users,
  Rocket,
  Shield,
  Clock as ClockIcon,
  BookOpenCheck,
  Lock,
  Cloud,
  BrainCircuit,
  LayoutDashboard,
  BarChart,
  Mail,
  Phone,
} from "lucide-react";

function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Navbar toggleSidebar={() => console.log("Sidebar toggled")} />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-20 pt-20 pb-24 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900"
      >
        <div className="md:w-1/2 space-y-6 mt-10 md:mt-0">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-[#0457A0] to-[#3DA3F5] bg-clip-text text-transparent"
          >
            Empowering Education, One Click at a Time
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed"
          >
            Transform your educational experience with our smart LMS solution
            designed to streamline course management, ensure academic integrity,
            and enhance learning outcomes through cutting-edge technology.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <button className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#0457A0] to-[#3DA3F5] text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <Rocket className="mr-3 h-5 w-5 group-hover:rotate-45 transition-transform" />
              <span className="text-lg font-semibold">Get Started Now</span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#3DA3F5] to-[#0457A0] opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="md:w-1/2 w-full flex justify-center"
        >
          <img
            src={HeroImage}
            alt="Education Platform Illustration"
            className="w-full max-w-xl rounded-2xl shadow-2xl border-8 border-white dark:border-gray-800 transform rotate-1 hover:rotate-0 transition-transform duration-300"
          />
        </motion.div>
      </motion.section>

      {/* About Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-24 px-6 md:px-20 bg-white dark:bg-gray-900"
      >
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative rounded-2xl overflow-hidden shadow-2xl"
          >
            <img
              src={AboutImage}
              alt="Platform Features"
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent" />
          </motion.div>

          <div className="space-y-8">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-[#0457A0] to-[#3DA3F5] bg-clip-text text-transparent">
              Revolutionizing Digital Education
            </h2>

            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              NOQISH LMS combines cutting-edge technology with pedagogical
              expertise to deliver a seamless learning management experience.
              Our platform empowers educators and students through:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: <Shield className="h-6 w-6" />,
                  title: "Academic Integrity",
                  text: "Advanced anti-cheating measures",
                },
                {
                  icon: <LayoutDashboard className="h-6 w-6" />,
                  title: "Course Management",
                  text: "Intuitive content organization",
                },
                {
                  icon: <BarChart className="h-6 w-6" />,
                  title: "Analytics",
                  text: "Real-time performance insights",
                },
                {
                  icon: <Cloud className="h-6 w-6" />,
                  title: "Cloud-Based",
                  text: "Access anywhere, anytime",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {feature.text}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-24 px-6 md:px-20 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-[#0457A0] to-[#3DA3F5] bg-clip-text text-transparent"
          >
            Powerful Features for Modern Education
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <BrainCircuit className="h-8 w-8" />,
                title: "Smart Exam Engine",
                text: "AI-powered question randomization and cheating prevention",
                color: "bg-purple-100 dark:bg-purple-900/30",
              },
              {
                icon: <BookOpenCheck className="h-8 w-8" />,
                title: "Course Builder",
                text: "Drag-and-drop content organization with multimedia support",
                color: "bg-green-100 dark:bg-green-900/30",
              },
              {
                icon: <Users className="h-8 w-8" />,
                title: "Collaboration Tools",
                text: "Real-time communication and group workspaces",
                color: "bg-blue-100 dark:bg-blue-900/30",
              },
              {
                icon: <Lock className="h-8 w-8" />,
                title: "Enterprise Security",
                text: "End-to-end encryption and role-based access",
                color: "bg-red-100 dark:bg-red-900/30",
              },
              {
                icon: <ClockIcon className="h-8 w-8" />,
                title: "24/7 Availability",
                text: "Cloud-based infrastructure with 99.9% uptime",
                color: "bg-yellow-100 dark:bg-yellow-900/30",
              },
              {
                icon: <BarChart className="h-8 w-8" />,
                title: "Advanced Analytics",
                text: "Detailed performance tracking and reporting",
                color: "bg-pink-100 dark:bg-pink-900/30",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all"
              >
                <div className={`${feature.color} w-fit p-4 rounded-xl mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 px-6 md:px-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-[#0457A0] to-[#3DA3F5] bg-clip-text text-transparent"
          >
            Meet Our Innovators
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              // {
              //   name: "Ahmed Abdi Hssan",
              //   role: "Fullstack Developer",
              //   expertise: "Web Apps",
              // },
              // {
              //   name: "Sabirin Mohamed Ali",
              //   role: "Fullstack Developer",
              //   expertise: "Web Apps",
              // },
              // {
              //   name: "Abdimalik Muse Rage",
              //   role: "UI/UX Visionary",
              //   expertise: "Interaction Design",
              
              {
                name: "Hawa Mohamed Ali",
                role: "Frontend Developer",
                expertise: "Web App",
              },
             
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent dark:from-gray-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6 flex items-center justify-center">
                    <UserRound className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {member.expertise}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 pt-24 pb-12 px-6 md:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-12">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-6">NOQISH LMS</h3>
            <p className="mb-6 leading-relaxed">
              Empowering educators and students through innovative learning
              solutions. Join thousands of institutions transforming their
              educational experience.
            </p>
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                Subscribe
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Platform</h4>
            <ul className="space-y-3">
              {["Features", "Pricing", "Demo", "Security"].map(
                (item, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="hover:text-blue-400 transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Resources</h4>
            <ul className="space-y-3">
              {["Documentation", "Guides", "Webinars", "Community"].map(
                (item, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="hover:text-blue-400 transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                support@noqish.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                +252 618 66 92 200
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm">
          <div className="mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} NOQISH LMS. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-blue-400 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
