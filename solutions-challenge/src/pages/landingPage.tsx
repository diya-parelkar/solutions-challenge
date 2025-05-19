import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Navbar from "../components/navbar"
import Prompt from "../assets/prompt1.png"
import Customize from "../assets/customize1.png"
import Generate from "../assets/generate.png"
import Learn from "../assets/learn1.png"
import Photosynthesis from "../assets/photosynthesis.png"
import Quantum from "../assets/quantum.png"
import Climate from "../assets/climate.png"
import GenerateDialog from "../components/GenerateDialog";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useThemeContext } from '../components/ThemeProvider';
import { Sun, Moon, Sparkles, BookOpen, Lightbulb, Zap, ArrowRight, ChevronRight, Github, Twitter, Linkedin } from "lucide-react";
import BookLogo from "../assets/book.png";

interface Example {
  title: string;
  level: string;
  image: string;
  tags: string[];
  contentType: string;
}

const TestimonialsSection = () => {
  const { getCombinedClasses } = useThemeContext();
  // Testimonials data
  const testimonials = [
    {
      name: "Dr. Sarah Chen",
      role: "High School Science Teacher",
      image: "https://i.pravatar.cc/150?img=1",
      quote: "EduGen has revolutionized how I teach complex scientific concepts. The interactive animations make abstract ideas tangible for my students.",
      rating: 5,
      tags: ["Science", "Education", "Interactive Learning"]
    },
    {
      name: "James Wilson",
      role: "Self-Learner",
      image: "https://i.pravatar.cc/150?img=2",
      quote: "As someone learning programming, the step-by-step visualizations have been invaluable. It's like having a personal tutor available 24/7.",
      rating: 5,
      tags: ["Programming", "Self-Learning", "Visual Learning"]
    },
    {
      name: "Maria Rodriguez",
      role: "University Professor",
      image: "https://i.pravatar.cc/150?img=3",
      quote: "The platform's ability to generate comprehensive learning materials has saved me countless hours of preparation time.",
      rating: 5,
      tags: ["Higher Education", "Time-Saving", "Content Generation"]
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.8 }}
      className="mt-12"
    >
      <div className="text-center mb-12">
        <Badge 
          variant="outline" 
          className="px-4 py-1.5 text-sm font-medium bg-emerald-500/10 text-emerald-500 border-emerald-500/20 mb-4"
        >
          Success Stories
        </Badge>
        <h2 className={getCombinedClasses('text.primary', 'text-3xl md:text-4xl font-bold mb-4')}>
          What Our Users Say
        </h2>
        <p className={getCombinedClasses('text.secondary', 'max-w-2xl mx-auto')}>
          Join thousands of satisfied educators and learners who have transformed their teaching and learning experience
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
            className="relative"
          >
            <Card className="h-full border-none bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500/20"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className={getCombinedClasses('text.primary', 'font-semibold')}>{testimonial.name}</h3>
                    <p className={getCombinedClasses('text.secondary', 'text-sm')}>{testimonial.role}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote className={getCombinedClasses('text.secondary', 'italic')}>
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex flex-wrap gap-2">
                  {testimonial.tags.map((tag, i) => (
                    <Badge 
                      key={i}
                      variant="outline"
                      className="bg-emerald-500/5 text-emerald-500 border-emerald-500/10"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const LandingPage = () => {
  const [prompt, setPrompt] = useState("");
  const { mode, toggleMode, getClasses, getCombinedClasses } = useThemeContext();
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const handleViewExample = (example: Example) => {
    const prompt = example.title || 'Explore Example';
    const level = example.level.toLowerCase().replace(/ /g, '-');
    let contentType: string;
    switch (example.contentType) {
      case "Concise - Quick Reads":
        contentType = "concise";
        break;
      case "Long form - Detailed":
        contentType = "detailed";
        break;
      default:
        contentType = example.contentType.toLowerCase().replace(/ /g, '-'); // Fallback
    }
    navigate(`/generated-website?prompt=${encodeURIComponent(prompt)}&level=${encodeURIComponent(level)}&contentType=${encodeURIComponent(contentType)}`);
  };

  return (
    <div className={`min-h-screen ${getClasses('background.primary')}`}>
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-6">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                'radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.08) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.08) 0%, transparent 50%)',
                'radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.08) 0%, transparent 50%)',
              ],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </div>

        <motion.div 
          style={{ opacity, scale }}
          className="container mx-auto px-6 relative z-10"
        >
          <div className="text-center max-w-3xl mx-auto space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-16"
            >
              <div className="flex items-center justify-center gap-3">
                <div className="w-8 h-8 rounded-lg shadow-lg bg-gradient-to-br from-white/80 to-emerald-100 p-1 dark:bg-gradient-to-br dark:from-white/60 dark:to-emerald-200 border border-white/70 dark:border-white/20 flex items-center justify-center">
                  <img
                    src={BookLogo}
                    alt="EduGen Logo"
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <Badge 
                  variant="outline" 
                  className={getCombinedClasses('badge.emerald', 'px-4 py-1 text-sm font-medium')}
                >
                  AI-Powered Learning
                </Badge>
              </div>
              
              <h1 className={`text-7xl md:text-7xl font-bold tracking-tight leading-[1.1] ${getClasses('text.primary')}`}>
                Turn a Thought into a <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">Learning Experience</span>
              </h1>
              
              {/* <p className={getCombinedClasses('text.secondary', 'text-lg max-w-xl mx-auto leading-relaxed')}>
                Create your own learning experience. Choose your level and get a guided, visual journey through any concept.
              </p> */}

              <div className="relative max-w-2xl mx-auto">
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-gradient"></div>
                  <Input 
                    placeholder="What would you like to learn today?" 
                    className={getCombinedClasses('background.card', 'relative h-16 text-xl shadow-2xl border-0 focus:ring-2 focus:ring-emerald-500/20 backdrop-blur-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-2xl pl-6 pr-32 text-gray-900 dark:text-white')}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    aria-label="Learning prompt input"
                  />
                  <Button 
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-12 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/20 rounded-xl font-medium text-lg transition-all duration-200 hover:shadow-emerald-500/30 hover:scale-105"
                    onClick={() => setIsGenerateDialogOpen(true)}
                  >
                    Generate
                    <ArrowRight className="ml-2 h-5 w-5 animate-pulse" />
                  </Button>
                </motion.div>
                <motion.p 
                  className={getCombinedClasses('text.secondary', 'mt-4 text-sm text-center')}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Try: "Explain quantum physics" or "How does photosynthesis work?"
                </motion.p>
              </div>

              <div className="flex flex-wrap justify-center gap-2 text-sm">
                {[
                  { icon: <Sparkles className="w-4 h-4" />, text: "AI-Powered", color: "from-emerald-500 to-teal-500" },
                  { icon: <BookOpen className="w-4 h-4" />, text: "Interactive Content", color: "from-blue-500 to-indigo-500" },
                  { icon: <Lightbulb className="w-4 h-4" />, text: "Smart Learning", color: "from-amber-500 to-orange-500" },
                  { icon: <Zap className="w-4 h-4" />, text: "Instant Generation", color: "from-purple-500 to-pink-500" }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -1 }}
                    className={getCombinedClasses('background.card', 'group relative flex items-center gap-2 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200')}
                  >
                    <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-200`} />
                    <div className="relative flex items-center gap-2">
                      <div className={getCombinedClasses('text.primary', '')}>
                        {feature.icon}
                      </div>
                      <span className={getCombinedClasses('text.primary', 'font-medium')}>{feature.text}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Generate Dialog */}
      <GenerateDialog prompt={prompt} open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen} />

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className={getCombinedClasses('text.primary', 'text-4xl md:text-5xl font-bold mb-4')}>
              Why Choose Our Platform?
            </h2>
            <p className={getCombinedClasses('text.secondary', 'text-lg max-w-2xl mx-auto text-lg')}>
              Experience learning like never before with our innovative features
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Interactive Learning",
                description: "Engage with dynamic content, animations, and interactive elements that make learning fun and effective.",
                icon: <Sparkles className="w-6 h-6" />,
                color: "from-emerald-500 to-teal-500"
              },
              {
                title: "AI-Powered Assistance",
                description: "Get personalized help and explanations from our AI tutor, available 24/7 to answer your questions.",
                icon: <Lightbulb className="w-6 h-6" />,
                color: "from-teal-500 to-cyan-500"
              },
              {
                title: "Visual Learning",
                description: "Learn through beautiful illustrations, diagrams, and animations that bring concepts to life.",
                icon: <BookOpen className="w-6 h-6" />,
                color: "from-cyan-500 to-blue-500"
              },
              {
                title: "Progress Tracking",
                description: "Monitor your learning journey with detailed progress reports and achievement badges.",
                icon: <Zap className="w-6 h-6" />,
                color: "from-blue-500 to-indigo-500"
              },
              {
                title: "Adaptive Content",
                description: "Content that adapts to your learning style and pace, ensuring optimal understanding.",
                icon: <Lightbulb className="w-6 h-6" />,
                color: "from-indigo-500 to-purple-500"
              },
              {
                title: "Resource Library",
                description: "Access a curated collection of additional resources, references, and study materials.",
                icon: <BookOpen className="w-6 h-6" />,
                color: "from-purple-500 to-pink-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="h-full border-none bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4`}>
                      {feature.icon}
                    </div>
                    <CardTitle className={getCombinedClasses('text.primary', 'text-xl')}>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={getCombinedClasses('text.secondary', '')}>{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10"></div>
        <div className="container mx-auto px-6 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <Badge 
              variant="outline" 
              className="px-4 py-1.5 text-sm font-medium bg-emerald-500/10 text-emerald-500 border-emerald-500/20 mb-4"
            >
              Simple Process
            </Badge>
            <h2 className={getCombinedClasses('text.primary', 'text-4xl md:text-5xl font-bold mb-4')}>
              How It Works
            </h2>
            <p className={getCombinedClasses('text.secondary', 'max-w-2xl mx-auto text-lg')}>
              Create your personalized learning experience in three simple steps
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Enter Your Prompt",
                  description: "Tell us what you want to learn about. It could be anything from 'Quantum Physics' to 'How to bake bread.'",
                  image: Prompt,
                  icon: <Lightbulb className="w-6 h-6" />,
                  color: "from-emerald-500 to-teal-500",
                  delay: 0
                },
                {
                  step: "02",
                  title: "AI Generation",
                  description: "Our AI creates a complete learning experience with interactive content, animations, and resources.",
                  image: Generate,
                  icon: <Zap className="w-6 h-6" />,
                  color: "from-teal-500 to-cyan-500",
                  delay: 0.2
                },
                {
                  step: "03",
                  title: "Learn & Explore",
                  description: "Engage with the content, interact with the AI tutor, and track your progress as you learn.",
                  image: Learn,
                  icon: <BookOpen className="w-6 h-6" />,
                  color: "from-cyan-500 to-blue-500",
                  delay: 0.4
                }
              ].map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: step.delay }}
                  className="relative"
                >
                  {/* Connection Line */}
                  {index < 2 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-emerald-500/50 to-transparent" />
                  )}
                  
                  <Card className="h-full border-none bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
                    <CardHeader className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                          {step.icon}
                        </div>
                        <span className={getCombinedClasses('text.secondary', 'text-4xl font-bold group-hover:text-emerald-500 transition-colors duration-300')}>
                          {step.step}
                        </span>
                      </div>
                      <CardTitle className={getCombinedClasses('text.primary', 'text-2xl font-bold')}>{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className={getCombinedClasses('text.secondary', '')}>{step.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Testimonials */}
            <TestimonialsSection />
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10"></div>
        <div className="container mx-auto px-8 md:px-12 lg:px-16 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className={getCombinedClasses('text.primary', 'text-4xl md:text-5xl font-bold mb-4')}>
              Explore Examples
            </h2>
            <p className={getCombinedClasses('text.secondary', 'max-w-2xl mx-auto text-lg')}>
              See how our platform transforms learning into an engaging experience
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {[
              {
                title: "Introduction to Photosynthesis",
                level: "School Kid",
                image: Photosynthesis,
                tags: ["Biology", "Interactive", "5 min read"],
                contentType: "Concise - Quick Reads",
              },
              {
                title: "Quantum Computing Fundamentals",
                level: "Expert",
                image: Quantum,
                tags: ["Physics", "Simulation", "15 min read"],
                contentType: "Long form - Detailed",
              },
              {
                title: "Climate Change Impacts",
                level: "Graduate Student",
                image: Climate,
                tags: ["Environmental Science", "Animations", "10 min read"],
                contentType: "Concise - Quick Reads",
              },
              {
                title: "History of Impressionism",
                level: "School Kid",
                image: Photosynthesis,
                tags: ["Art", "Visual", "7 min read"],
                contentType: "Concise - Quick Reads",
              },
              {
                title: "Black Holes Explained",
                level: "Graduate Student",
                image: Quantum,
                tags: ["Astronomy", "Animations", "12 min read"],
                contentType: "Long form - Detailed",
              },
              {
                title: "The Water Cycle",
                level: "School Kid",
                image: Climate,
                tags: ["Geography", "Interactive", "6 min read"],
                contentType: "Concise - Quick Reads",
              },
            ].map((example, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.03 }}
                className="h-full cursor-pointer group"
              >
                <Card className="overflow-hidden border-none bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                  <div className="h-48 relative group">
                    <img 
                      src={example.image} 
                      alt={example.title} 
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <Badge className="bg-black/60 backdrop-blur-md px-3 py-1.5 text-sm font-medium text-white border border-white/20">
                        {example.level}
                      </Badge>
                      <Badge className="bg-emerald-500/90 backdrop-blur-md px-3 py-1.5 text-sm font-medium text-white border border-white/20">
                        {example.contentType}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="space-y-4 flex-none">
                    <div className="space-y-2">
                      <CardTitle className={getCombinedClasses('text.primary', 'text-2xl font-bold')}>
                        {example.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm">
                        <span className={getCombinedClasses('text.secondary', 'flex items-center gap-1')}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                          {example.tags.find(tag => tag.includes('min read'))}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-400/50"></span>
                        <span className={getCombinedClasses('text.secondary', 'flex items-center gap-1')}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-open"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                          {example.contentType}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6 flex-grow">
                    <div className="flex flex-wrap gap-2">
                      {example.tags
                        .filter(tag => !tag.includes('min read'))
                        .map((tag, tagIndex) => (
                          <Badge 
                            key={tagIndex} 
                            variant="outline"
                            className={getCombinedClasses('background.card', 'px-3 py-1 text-sm font-medium')}
                          >
                            <span className={getCombinedClasses('text.primary', '')}>{tag}</span>
                          </Badge>
                      ))}
                    </div>
                    <div className={getCombinedClasses('background.card', 'flex items-center gap-4 p-4 rounded-lg')}>
                      <div className="flex-1">
                        <h4 className={getCombinedClasses('text.primary', 'font-semibold mb-1')}>Learning Level</h4>
                        <p className={getCombinedClasses('text.secondary', 'text-sm')}>
                          {example.level}
                        </p>
                      </div>
                      <div className="flex-1">
                        <h4 className={getCombinedClasses('text.primary', 'font-semibold mb-1')}>Content Type</h4>
                        <p className={getCombinedClasses('text.secondary', 'text-sm')}>
                          {example.contentType}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex-none">
                    <Button 
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white h-12 text-lg group"
                      onClick={() => handleViewExample(example)}
                    >
                      View Example
                      <motion.span
                        className="ml-2"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20"></div>
        <motion.div 
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)',
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <div className="container mx-auto px-6 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className={getCombinedClasses('text.primary', 'text-4xl md:text-5xl font-bold mb-8')}>
              Ready to Transform Your Learning Experience?
            </h2>
            <p className={getCombinedClasses('text.secondary', 'text-lg mb-10')}>
              Join thousands of learners who are already creating personalized, interactive learning experiences.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Button 
                size="lg" 
                className="h-14 px-10 text-lg bg-emerald-500 hover:bg-emerald-600 text-white"
                onClick={() => setIsGenerateDialogOpen(true)}
              >
                Get Started for Free
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="h-14 px-10 text-lg border-emerald-500/20 hover:border-emerald-500/40"
              >
                View Examples
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg shadow-lg bg-gradient-to-br from-white/80 to-emerald-100 p-1 dark:bg-gradient-to-br dark:from-white/60 dark:to-emerald-200 border border-white/70 dark:border-white/20 flex items-center justify-center">
                  <img
                    src={BookLogo}
                    alt="EduGen Logo"
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-2xl bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                    EduGen
                  </span>
                  <span className={getCombinedClasses('text.secondary', 'text-sm')}>AI-Powered Learning</span>
                </div>
              </div>
              <p className={getCombinedClasses('text.secondary', 'text-sm mb-6')}>
                Create beautiful, interactive learning experiences with AI-powered content generation.
              </p>
              <div className="flex gap-5">
                {[
                  { icon: <Twitter className="w-6 h-6" />, label: "Twitter" },
                  { icon: <Github className="w-6 h-6" />, label: "GitHub" },
                  { icon: <Linkedin className="w-6 h-6" />, label: "LinkedIn" }
                ].map((social) => (
                  <motion.a 
                    key={social.label}
                    href="#" 
                    className={getCombinedClasses('text.primary', 'hover:text-emerald-500 transition-colors')}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={`Visit our ${social.label} page`}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>
            
            {[
              {
                title: "Resources",
                links: ["Documentation", "Tutorials", "API Reference", "Community"]
              },
              {
                title: "Company",
                links: ["About", "Blog", "Careers", "Contact"]
              },
              {
                title: "Legal",
                links: ["Terms", "Privacy", "Cookies", "GDPR"]
              }
            ].map((section) => (
              <div key={section.title}>
                <h3 className={getCombinedClasses('text.primary', 'font-semibold text-lg mb-6')}>{section.title}</h3>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link}>
                      <motion.a 
                        href="#" 
                        className={getCombinedClasses('text.primary', 'hover:text-emerald-500 transition-colors')}
                        whileHover={{ x: 5 }}
                      >
                        {link}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-emerald-500/10 mt-16 pt-8 text-center">
            <p className={getCombinedClasses('text.secondary', 'text-sm')}>&copy; {new Date().getFullYear()} EduGen. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Theme Switcher */}
      <motion.button
        className={getCombinedClasses('background.card', 'fixed bottom-8 right-8 p-4 rounded-full shadow-lg border border-emerald-500/20')}
        onClick={toggleMode}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
      >
        {mode === 'dark' ? (
          <Sun className={getCombinedClasses('text.primary', 'w-6 h-6')} />
        ) : (
          <Moon className={getCombinedClasses('text.primary', 'w-6 h-6')} />
        )}
      </motion.button>

      {/* Login Button */}
      <Button 
        onClick={() => setIsLoginOpen(true)} 
        className={getCombinedClasses('text.primary', 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800')}
      >
        Login
      </Button>
    </div>
  );
}

export default LandingPage;