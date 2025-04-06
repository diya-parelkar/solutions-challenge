import React, { useState } from 'react';
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


export default function LandingPage() {
  const [prompt, setPrompt] = useState("");

  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-background to-muted">
        <div className="container mx-auto px-4 text-center">
          {/* <Badge variant="outline" className="mb-4">SDG Goal 4: Quality Education</Badge> */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Educational Websites from a Single Prompt</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Type in a topic, and we’ll build an interactive learning site with images, lessons, and your personal AI study buddy.
          </p>
          <div className="max-w-xl mx-auto mb-10">
            <div className="flex flex-col sm:flex-row gap-2">
              <Input 
                placeholder="What would you like to learn today?" 
                className="h-12"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <GenerateDialog prompt={prompt} />
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Interactive lessons
            </span>
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Multiple learning levels
            </span>
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Images
            </span>
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              AI Chatbot
            </span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How We Enhance Learning</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered platform creates tailored websites that adapt to different learning styles and levels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Personalized Learning",
                description: "Choose between 5 different levels of explanation, from 'Explain like I'm 5' to 'Expert Level.'",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                )
              },
              {
                title: "Chatbot Support",
                description: "Get real-time assistance and answers with an AI-powered chatbot integrated throughout the learning experience.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                )
              },
              {
                title: "Visual Learning",
                description: "Every topic includes relevant images, illustrations, and visual aids to enhance understanding.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                )
              },
              {
                title: "Progress Tracking",
                description: "Track your learning journey with progress bars, XP points, and achievements.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" x2="12" y1="20" y2="10" />
                    <line x1="18" x2="18" y1="20" y2="4" />
                    <line x1="6" x2="6" y1="20" y2="16" />
                  </svg>
                )
              },
              {
                title: "Adaptive Content",
                description: "Choose between quick reads or detailed long-form content based on your time constraints.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                )
              },
              {
                title: "Learn by Doing",
                description: "Interactive quizzes and challenges after each module to reinforce what you've learned.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                    <path d="M12 9v4" />
                    <path d="M12 17h.01" />
                  </svg>
                )
              }
            ].map((feature, index) => (
              <Card key={index} className="border-none shadow-sm">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section - Enhanced Size */}
      <section id="how-it-works" className="py-24 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">How It Works</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
              Build your personalized learning experience in just a few simple steps.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <Tabs defaultValue="prompt" className="w-full">
              <TabsList className="grid w-full grid-cols-4 p-1 mb-8">
                <TabsTrigger value="prompt" className="text-sm sm:text-base py-3">1. Enter Prompt</TabsTrigger>
                <TabsTrigger value="customize" className="text-sm sm:text-base py-3">2. Customize</TabsTrigger>
                <TabsTrigger value="generate" className="text-sm sm:text-base py-3">3. Generate</TabsTrigger>
                <TabsTrigger value="learn" className="text-sm sm:text-base py-3">4. Learn</TabsTrigger>
              </TabsList>
              {[
                {
                  value: "prompt",
                  title: "Start with a simple prompt",
                  description: "Tell us what you want to learn about. It could be 'Photosynthesis,' 'Quantum Physics,' or even 'How to bake bread.'",
                  image: Prompt,
                  icon: "Lightbulb",
                },
                {
                  value: "customize",
                  title: "Customize your learning experience",
                  description: "Choose your learning level, content type (concise or detailed).",
                  image: Customize,
                  icon: "Settings",
                },
                {
                  value: "generate",
                  title: "Generate your educational website",
                  description: "Our AI creates a complete educational website with images, chatbot assistance, and structured content.",
                  image: Generate,
                  icon: "Zap",
                },
                {
                  value: "learn",
                  title: "Learn at your own pace",
                  description: "Work through the modules, and deepen your understanding through interactive content.",
                  image: Learn, 
                  icon: "GraduationCap",
                },
              ].map((tab) => (
                <TabsContent key={tab.value} value={tab.value} className="p-8 bg-background rounded-xl shadow-md mt-6 border border-border">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-3 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                            {tab.icon === "Lightbulb" && <>
                              <line x1="9" y1="18" x2="15" y2="18"></line>
                              <line x1="10" y1="22" x2="14" y2="22"></line>
                              <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"></path>
                            </>}
                            {tab.icon === "Settings" && <>
                              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                              <circle cx="12" cy="12" r="3"></circle>
                            </>}
                            {tab.icon === "Zap" && <>
                              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                            </>}
                            {tab.icon === "GraduationCap" && <>
                              <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                              <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                            </>}
                          </svg>
                        </div>
                        <h3 className="text-2xl font-semibold">{tab.title}</h3>
                      </div>
                      <p className="text-muted-foreground text-lg leading-relaxed">{tab.description}</p>
                    </div>
                    <div className="order-first lg:order-last mb-6 lg:mb-0">
                    <img 
                      src={tab.image} 
                      alt={tab.title} 
                      className="rounded-xl border border-gray-100 shadow-lg w-full h-auto object-contain"
                    />
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
            <div className="text-center mt-16">
              <Button size="lg" className="px-8 py-6 text-lg" onClick={handleGetStarted}>
                Get Started
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section id="examples" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Example Learning Websites</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore some of the educational websites created by our users.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Introduction to Photosynthesis",
                level: "School Kid",
                image: Photosynthesis,
                tags: ["Biology", "Interactive", "5-minute read"]
              },
              {
                title: "Quantum Computing Fundamentals",
                level: "Graduate Student",
                image: Quantum,
                tags: ["Physics", "Simulation", "20-minute read"]
              },
              {
                title: "Climate Change Impacts",
                level: "High School",
                image: Climate,
                tags: ["Environmental Science", "Animations", "15-minute read"]
              },
            ].map((example, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="aspect-video relative">
                  <img src={example.image} alt={example.title} className="object-cover w-full h-[400px]" />
                  <Badge className="absolute top-2 right-2">{example.level}</Badge>
                </div>
                <CardHeader>
                  <CardTitle>{example.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {example.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">View Example</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Button size="lg">View All Examples</Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Learning Experience?</h2>
          <p className="max-w-2xl mx-auto mb-8">
            Join thousands of students and educators who are using our platform to create customized, interactive learning experiences.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" variant="secondary">Learn More</Button>
            <Button size="lg" variant="default" className="bg-background text-foreground hover:bg-background/90">Get Started for Free</Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                  <path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" />
                  <path d="M12 12v5" />
                  <path d="M8 12v5" />
                  <path d="M16 12v5" />
                </svg>
                <span className="font-bold">EduGen</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Create educational websites with animations, illustrations, and personalized content from a simple prompt.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Documentation</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Tutorials</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">API Reference</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Community Forum</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">About Us</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Blog</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Careers</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Cookie Policy</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">GDPR Compliance</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-12 pt-6 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} EduGen. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}