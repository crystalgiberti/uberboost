import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  HelpCircle,
  Search,
  BookOpen,
  MessageCircle,
  Video,
  FileText,
  Zap,
  Mic,
  Car,
  TrendingUp,
  Settings,
  ChevronDown,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  popular: boolean;
}

interface Tutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  icon: React.ComponentType<{ className?: string }>;
  steps: string[];
}

export default function Help() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const faqs: FAQ[] = [
    {
      id: "1",
      question: "How do I log a ride using voice commands?",
      answer:
        'Tap the microphone button in the Ride Logger and say something like "From downtown to airport, UberX, twenty five dollars, one point five times surge, twenty minutes, five dollar tip". The app will automatically parse your speech and fill in the form fields.',
      category: "voice",
      popular: true,
    },
    {
      id: "2",
      question: "Why isn't voice recognition working?",
      answer:
        "Voice recognition requires microphone permissions and works best in Chrome, Safari, or Edge browsers. Make sure you've allowed microphone access and are speaking clearly. If it still doesn't work, you can always enter data manually.",
      category: "voice",
      popular: true,
    },
    {
      id: "3",
      question: "How do I start the AI schedule?",
      answer:
        'Go to the Schedule page and tap "Start Schedule". This will activate live tracking of your current schedule item and can navigate you to surge areas when it\'s time to drive.',
      category: "schedule",
      popular: true,
    },
    {
      id: "4",
      question: "Can I export my ride data?",
      answer:
        'Yes! In the Ride Logger, tap the "Export" button to download all your ride data as a CSV file. You can also import existing ride data from CSV files.',
      category: "data",
      popular: false,
    },
    {
      id: "5",
      question: "How accurate are the surge predictions?",
      answer:
        "Our surge predictions use real-time data analysis including traffic patterns, events, weather, and historical data. Confidence levels are shown for each prediction, typically ranging from 75-95% accuracy.",
      category: "surge",
      popular: true,
    },
    {
      id: "6",
      question: "Does the app track my location?",
      answer:
        "No, the app does not track or store your real location data. All location references are based on areas you manually enter or select from city lists.",
      category: "privacy",
      popular: false,
    },
    {
      id: "7",
      question: "How do I change cities?",
      answer:
        "On the main page, use the location dropdown to select your city. This will update surge predictions and schedule recommendations for your area.",
      category: "settings",
      popular: false,
    },
    {
      id: "8",
      question: "What browsers work best with this app?",
      answer:
        "The app works in all modern browsers, but Chrome, Safari, and Edge provide the best experience, especially for voice features. Firefox works but may have limited voice recognition support.",
      category: "technical",
      popular: false,
    },
  ];

  const tutorials: Tutorial[] = [
    {
      id: "1",
      title: "Getting Started with Uber Boost",
      description: "Learn the basics of navigating and using the app",
      duration: "5 min",
      difficulty: "beginner",
      icon: Zap,
      steps: [
        "Explore the main dashboard and earnings tracker",
        "Set your daily earning goals",
        "Choose your operating city from the dropdown",
        "Review the surge prediction areas",
        "Navigate between different app sections",
      ],
    },
    {
      id: "2",
      title: "Voice-Powered Ride Logging",
      description: "Master hands-free ride entry with voice commands",
      duration: "3 min",
      difficulty: "beginner",
      icon: Mic,
      steps: [
        "Grant microphone permissions to your browser",
        "Open the Ride Logger page",
        "Tap the microphone button to start recording",
        "Speak your ride details naturally",
        "Review and save the automatically filled form",
      ],
    },
    {
      id: "3",
      title: "AI Schedule Optimization",
      description: "Use AI to maximize your earning potential",
      duration: "7 min",
      difficulty: "intermediate",
      icon: TrendingUp,
      steps: [
        "Review your weekly earning goals",
        "Enable AI Auto-Schedule feature",
        "Understand the daily schedule recommendations",
        "Start an active schedule session",
        "Follow surge navigation suggestions",
      ],
    },
    {
      id: "4",
      title: "Vehicle & Expense Tracking",
      description: "Track maintenance and operating costs",
      duration: "8 min",
      difficulty: "intermediate",
      icon: Car,
      steps: [
        "Add your vehicle information",
        "Log maintenance records",
        "Set up maintenance reminders",
        "Track fuel costs and efficiency",
        "Export expense reports for taxes",
      ],
    },
  ];

  const categories = [
    { id: "all", label: "All Topics", count: faqs.length },
    {
      id: "voice",
      label: "Voice Features",
      count: faqs.filter((f) => f.category === "voice").length,
    },
    {
      id: "schedule",
      label: "Scheduling",
      count: faqs.filter((f) => f.category === "schedule").length,
    },
    {
      id: "surge",
      label: "Surge Predictions",
      count: faqs.filter((f) => f.category === "surge").length,
    },
    {
      id: "data",
      label: "Data & Export",
      count: faqs.filter((f) => f.category === "data").length,
    },
    {
      id: "privacy",
      label: "Privacy",
      count: faqs.filter((f) => f.category === "privacy").length,
    },
  ];

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const popularFAQs = faqs.filter((faq) => faq.popular);

  return (
    <div className="min-h-screen bg-gradient-to-br from-florida-sky via-background to-florida-ocean/10 pb-20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-florida-ocean/20 sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold text-foreground">Help Center</h1>
              <p className="text-xs text-muted-foreground">
                Tutorials, FAQs & Support
              </p>
            </div>
          </div>
          <HelpCircle className="w-6 h-6 text-florida-ocean" />
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Search */}
        <Card className="border-florida-ocean/20">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search for help topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-florida-sunset/20 bg-gradient-to-r from-white to-florida-sunset-light/20">
            <CardContent className="p-4 text-center">
              <Video className="w-8 h-8 text-florida-sunset mx-auto mb-2" />
              <div className="font-semibold text-florida-sunset mb-1">
                Video Tutorials
              </div>
              <div className="text-xs text-muted-foreground">
                Watch step-by-step guides
              </div>
            </CardContent>
          </Card>
          <Card className="border-florida-palm/20 bg-gradient-to-r from-white to-florida-palm/10">
            <CardContent className="p-4 text-center">
              <MessageCircle className="w-8 h-8 text-florida-palm mx-auto mb-2" />
              <div className="font-semibold text-florida-palm mb-1">
                Live Support
              </div>
              <div className="text-xs text-muted-foreground">
                Chat with our team
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Popular FAQs */}
        {searchQuery === "" && selectedCategory === "all" && (
          <Card className="border-florida-coral/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-florida-coral" />
                Popular Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {popularFAQs.slice(0, 3).map((faq) => (
                <div
                  key={faq.id}
                  className="p-3 bg-white/60 rounded-lg border border-florida-coral/20 cursor-pointer hover:bg-white/80 transition-all"
                  onClick={() =>
                    setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)
                  }
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{faq.question}</span>
                    {expandedFAQ === faq.id ? (
                      <ChevronDown className="w-4 h-4 text-florida-coral" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-florida-coral" />
                    )}
                  </div>
                  {expandedFAQ === faq.id && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Tutorials */}
        <Card className="border-florida-ocean/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-florida-ocean" />
              Interactive Tutorials
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {tutorials.map((tutorial) => (
              <div
                key={tutorial.id}
                className="p-4 bg-white/50 rounded-lg border border-gray-200 hover:bg-white/80 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-florida-ocean/20 rounded-lg flex items-center justify-center">
                      <tutorial.icon className="w-5 h-5 text-florida-ocean" />
                    </div>
                    <div>
                      <div className="font-semibold">{tutorial.title}</div>
                      <div className="text-sm text-muted-foreground mb-2">
                        {tutorial.description}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="text-xs border-florida-ocean text-florida-ocean"
                        >
                          {tutorial.duration}
                        </Badge>
                        <Badge
                          className={`text-xs ${
                            tutorial.difficulty === "beginner"
                              ? "bg-green-100 text-green-800"
                              : tutorial.difficulty === "intermediate"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {tutorial.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Start
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* FAQ Categories */}
        <Card className="border-florida-sunset/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-florida-sunset" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={
                    selectedCategory === category.id ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={
                    selectedCategory === category.id
                      ? "bg-florida-sunset text-white"
                      : "border-florida-sunset/30"
                  }
                >
                  {category.label} ({category.count})
                </Button>
              ))}
            </div>

            {/* FAQ List */}
            <div className="space-y-3">
              {filteredFAQs.map((faq) => (
                <div
                  key={faq.id}
                  className="p-4 bg-white/60 rounded-lg border border-gray-200 cursor-pointer hover:bg-white/80 transition-all"
                  onClick={() =>
                    setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)
                  }
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{faq.question}</span>
                      {faq.popular && (
                        <Badge className="bg-florida-coral text-white text-xs">
                          Popular
                        </Badge>
                      )}
                    </div>
                    {expandedFAQ === faq.id ? (
                      <ChevronDown className="w-4 h-4 text-florida-sunset" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-florida-sunset" />
                    )}
                  </div>
                  {expandedFAQ === faq.id && (
                    <div className="mt-3 text-sm text-muted-foreground border-t pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
              {filteredFAQs.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No results found for "{searchQuery}"</p>
                  <p className="text-sm">
                    Try different keywords or browse categories
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card className="border-florida-palm/20 bg-gradient-to-r from-white to-florida-palm/10">
          <CardContent className="p-6 text-center">
            <MessageCircle className="w-12 h-12 text-florida-palm mx-auto mb-3" />
            <h3 className="font-semibold text-florida-palm mb-2">
              Still Need Help?
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Our support team is here to help you succeed with Uber driving
            </p>
            <div className="flex gap-2 justify-center">
              <Button className="bg-florida-palm hover:bg-florida-palm/90 text-white">
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat with Support
              </Button>
              <Button
                variant="outline"
                className="border-florida-palm text-florida-palm"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Email Us
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
