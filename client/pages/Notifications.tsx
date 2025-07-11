import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  Zap,
  Cloud,
  Navigation,
  DollarSign,
  Car,
  AlertTriangle,
  CheckCircle,
  Settings,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Notification {
  id: string;
  type: "surge" | "weather" | "traffic" | "earnings" | "maintenance" | "system";
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  priority: "high" | "medium" | "low";
  actionLabel?: string;
  actionUrl?: string;
}

export default function Notifications() {
  const navigate = useNavigate();
  const [notificationSettings, setNotificationSettings] = useState({
    surgeAlerts: true,
    weatherAlerts: true,
    trafficAlerts: true,
    earningsAlerts: true,
    maintenanceReminders: true,
    systemUpdates: false,
  });

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "surge",
      title: "🔥 2.8x Surge at Jacksonville Landing",
      message:
        "High demand near Jacksonville Landing. Jaguars game ending soon.",
      time: "2 min ago",
      isRead: false,
      priority: "high",
      actionLabel: "Navigate",
      actionUrl: "/surge-navigation",
    },
    {
      id: "2",
      type: "weather",
      title: "☔ Rain Surge Incoming",
      message: "Light rain starting in 20 minutes. Expect 25% demand increase.",
      time: "8 min ago",
      isRead: false,
      priority: "high",
    },
    {
      id: "3",
      type: "earnings",
      title: "💰 Daily Goal Update",
      message:
        "You're $62.50 away from your $150 daily goal. 3 more rides should do it!",
      time: "15 min ago",
      isRead: true,
      priority: "medium",
    },
    {
      id: "4",
      type: "traffic",
      title: "🚧 I-95 Accident Alert",
      message:
        "Major accident on I-95 North near Airport Rd. Consider alternate routes.",
      time: "22 min ago",
      isRead: true,
      priority: "medium",
      actionLabel: "View Map",
      actionUrl: "/traffic",
    },
    {
      id: "5",
      type: "maintenance",
      title: "🔧 Vehicle Maintenance Reminder",
      message:
        "Your Toyota Camry is due for an oil change (3,247 miles driven).",
      time: "1 hour ago",
      isRead: true,
      priority: "low",
    },
    {
      id: "6",
      type: "system",
      title: "📱 App Update Available",
      message:
        "Version 2.1.0 includes improved surge predictions and bug fixes.",
      time: "3 hours ago",
      isRead: true,
      priority: "low",
      actionLabel: "Update",
    },
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "surge":
        return Zap;
      case "weather":
        return Cloud;
      case "traffic":
        return Navigation;
      case "earnings":
        return DollarSign;
      case "maintenance":
        return Car;
      case "system":
        return Bell;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type: string, priority: string) => {
    if (priority === "high") return "florida-coral";
    if (type === "surge") return "florida-sunset";
    if (type === "weather") return "florida-sky";
    if (type === "earnings") return "florida-palm";
    return "florida-ocean";
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif,
      ),
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, isRead: true })),
    );
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const todayNotifications = notifications.filter(
    (n) => n.time.includes("min ago") || n.time.includes("hour ago"),
  );
  const olderNotifications = notifications.filter(
    (n) => !n.time.includes("min ago") && !n.time.includes("hour ago"),
  );

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
              <h1 className="text-lg font-bold text-foreground">
                Notifications
              </h1>
              <p className="text-xs text-muted-foreground">
                {unreadCount} unread notifications
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                <CheckCircle className="w-4 h-4 mr-1" />
                Mark All Read
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/settings")}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="p-4">
        <Tabs defaultValue="notifications" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="notifications">
              Notifications {unreadCount > 0 && `(${unreadCount})`}
            </TabsTrigger>
            <TabsTrigger value="settings">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-4">
            {/* Today's Notifications */}
            {todayNotifications.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Today</h3>
                {todayNotifications.map((notification) => {
                  const Icon = getNotificationIcon(notification.type);
                  const color = getNotificationColor(
                    notification.type,
                    notification.priority,
                  );

                  return (
                    <Card
                      key={notification.id}
                      className={`border-${color}/20 ${
                        !notification.isRead ? "bg-white" : "bg-gray-50/50"
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div
                            className={`w-10 h-10 bg-${color}/20 rounded-lg flex items-center justify-center flex-shrink-0`}
                          >
                            <Icon className={`w-5 h-5 text-${color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4
                                  className={`font-medium ${
                                    !notification.isRead
                                      ? "text-foreground"
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  {notification.title}
                                </h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {notification.message}
                                </p>
                                <div className="flex items-center justify-between mt-2">
                                  <span className="text-xs text-muted-foreground">
                                    {notification.time}
                                  </span>
                                  {!notification.isRead && (
                                    <Badge
                                      className={`bg-${color} text-white text-xs`}
                                    >
                                      {notification.priority}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="flex space-x-1 ml-2">
                                {!notification.isRead && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => markAsRead(notification.id)}
                                    className="w-8 h-8 p-0"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    deleteNotification(notification.id)
                                  }
                                  className="w-8 h-8 p-0 text-gray-400 hover:text-red-500"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            {notification.actionLabel && (
                              <Button
                                size="sm"
                                className={`mt-2 bg-${color} hover:bg-${color}/90 text-white`}
                                onClick={() => {
                                  if (notification.actionUrl) {
                                    navigate(notification.actionUrl);
                                  }
                                  markAsRead(notification.id);
                                }}
                              >
                                {notification.actionLabel}
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Older Notifications */}
            {olderNotifications.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Earlier</h3>
                {olderNotifications.map((notification) => {
                  const Icon = getNotificationIcon(notification.type);
                  const color = getNotificationColor(
                    notification.type,
                    notification.priority,
                  );

                  return (
                    <Card
                      key={notification.id}
                      className="border-gray-200 bg-gray-50/50"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <Icon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-600">
                              {notification.title}
                            </h4>
                            <p className="text-sm text-gray-500 mt-1">
                              {notification.message}
                            </p>
                            <span className="text-xs text-gray-400">
                              {notification.time}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            className="w-8 h-8 p-0 text-gray-400 hover:text-red-500"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {notifications.length === 0 && (
              <Card className="border-florida-ocean/20">
                <CardContent className="p-8 text-center">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-600 mb-2">
                    No notifications
                  </h3>
                  <p className="text-gray-500">
                    You're all caught up! New notifications will appear here.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card className="border-florida-ocean/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-florida-ocean" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(notificationSettings).map(
                  ([key, enabled], index) => {
                    const labels: Record<string, any> = {
                      surgeAlerts: {
                        title: "Surge Alerts",
                        description:
                          "Get notified when surge pricing is active",
                        icon: Zap,
                      },
                      weatherAlerts: {
                        title: "Weather Alerts",
                        description:
                          "Notifications for weather-related demand changes",
                        icon: Cloud,
                      },
                      trafficAlerts: {
                        title: "Traffic Alerts",
                        description: "Traffic incidents and road closures",
                        icon: Navigation,
                      },
                      earningsAlerts: {
                        title: "Earnings Updates",
                        description:
                          "Daily goal progress and earnings milestones",
                        icon: DollarSign,
                      },
                      maintenanceReminders: {
                        title: "Maintenance Reminders",
                        description: "Vehicle maintenance and service alerts",
                        icon: Car,
                      },
                      systemUpdates: {
                        title: "System Updates",
                        description: "App updates and system announcements",
                        icon: Bell,
                      },
                    };

                    const config = labels[key];
                    const Icon = config.icon;

                    return (
                      <div key={key} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Icon className="w-5 h-5 text-florida-ocean" />
                            <div>
                              <div className="font-medium">{config.title}</div>
                              <div className="text-sm text-muted-foreground">
                                {config.description}
                              </div>
                            </div>
                          </div>
                          <Switch
                            checked={enabled}
                            onCheckedChange={(checked) =>
                              setNotificationSettings((prev) => ({
                                ...prev,
                                [key]: checked,
                              }))
                            }
                          />
                        </div>
                        {index <
                          Object.keys(notificationSettings).length - 1 && (
                          <hr className="border-gray-200" />
                        )}
                      </div>
                    );
                  },
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
