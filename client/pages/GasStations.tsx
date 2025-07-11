import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Fuel,
  MapPin,
  Navigation,
  Clock,
  DollarSign,
  Star,
  Phone,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function GasStations() {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("price");

  // Mock gas station data based on Jacksonville
  const gasStations = [
    {
      id: 1,
      name: "Costco Gas Station",
      brand: "Costco",
      price: 2.859,
      distance: 0.8,
      rating: 4.2,
      address: "10251 River City Dr, Jacksonville, FL",
      isOpen: true,
      hours: "Mon-Fri: 6AM-10PM",
      amenities: ["Membership Required", "Credit/Debit Only"],
      lastUpdated: "5 min ago",
    },
    {
      id: 2,
      name: "Wawa",
      brand: "Wawa",
      price: 2.899,
      distance: 0.3,
      rating: 4.5,
      address: "9965 Atlantic Blvd, Jacksonville, FL",
      isOpen: true,
      hours: "24/7",
      amenities: ["Food", "ATM", "Car Wash"],
      lastUpdated: "2 min ago",
    },
    {
      id: 3,
      name: "Shell",
      brand: "Shell",
      price: 2.929,
      distance: 0.5,
      rating: 4.1,
      address: "9401 Beach Blvd, Jacksonville, FL",
      isOpen: true,
      hours: "24/7",
      amenities: ["Food Mart", "Car Wash", "ATM"],
      lastUpdated: "8 min ago",
    },
    {
      id: 4,
      name: "RaceTrac",
      brand: "RaceTrac",
      price: 2.949,
      distance: 1.2,
      rating: 4.3,
      address: "8539 Phillips Hwy, Jacksonville, FL",
      isOpen: true,
      hours: "24/7",
      amenities: ["Food", "ATM", "Air Pump"],
      lastUpdated: "12 min ago",
    },
    {
      id: 5,
      name: "Gate Petroleum",
      brand: "Gate",
      price: 2.959,
      distance: 0.7,
      rating: 3.9,
      address: "4555 Blanding Blvd, Jacksonville, FL",
      isOpen: true,
      hours: "5AM-11PM",
      amenities: ["Food Mart", "ATM"],
      lastUpdated: "15 min ago",
    },
    {
      id: 6,
      name: "Murphy USA",
      brand: "Murphy USA",
      price: 2.879,
      distance: 2.1,
      rating: 4.0,
      address: "13490 Beach Blvd, Jacksonville, FL",
      isOpen: true,
      hours: "6AM-10PM",
      amenities: ["Walmart Location", "ATM"],
      lastUpdated: "18 min ago",
    },
  ];

  const sortedStations = [...gasStations].sort((a, b) => {
    if (sortBy === "price") return a.price - b.price;
    if (sortBy === "distance") return a.distance - b.distance;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  const avgPrice =
    gasStations.reduce((sum, station) => sum + station.price, 0) /
    gasStations.length;
  const cheapestPrice = Math.min(...gasStations.map((s) => s.price));
  const savings = (avgPrice - cheapestPrice) * 15; // 15 gallon tank

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
                Find Cheap Gas
              </h1>
              <p className="text-xs text-muted-foreground">
                Save money on fuel costs
              </p>
            </div>
          </div>
          <Badge className="bg-florida-coral text-white">
            Save ${savings.toFixed(2)}
          </Badge>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="border-florida-ocean/20">
            <CardContent className="p-3 text-center">
              <Fuel className="w-6 h-6 text-florida-ocean mx-auto mb-1" />
              <div className="text-lg font-bold text-florida-ocean">
                ${cheapestPrice.toFixed(3)}
              </div>
              <div className="text-xs text-muted-foreground">Lowest Price</div>
            </CardContent>
          </Card>
          <Card className="border-florida-palm/20">
            <CardContent className="p-3 text-center">
              <DollarSign className="w-6 h-6 text-florida-palm mx-auto mb-1" />
              <div className="text-lg font-bold text-florida-palm">
                ${savings.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">
                Potential Savings
              </div>
            </CardContent>
          </Card>
          <Card className="border-florida-sunset/20">
            <CardContent className="p-3 text-center">
              <MapPin className="w-6 h-6 text-florida-sunset mx-auto mb-1" />
              <div className="text-lg font-bold text-florida-sunset">
                {gasStations.length}
              </div>
              <div className="text-xs text-muted-foreground">
                Nearby Stations
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sort Controls */}
        <Card className="border-florida-ocean/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Sort by:</span>
              <div className="flex space-x-2">
                <Button
                  variant={sortBy === "price" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortBy("price")}
                  className={
                    sortBy === "price" ? "bg-florida-ocean text-white" : ""
                  }
                >
                  Price
                </Button>
                <Button
                  variant={sortBy === "distance" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortBy("distance")}
                  className={
                    sortBy === "distance" ? "bg-florida-ocean text-white" : ""
                  }
                >
                  Distance
                </Button>
                <Button
                  variant={sortBy === "rating" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortBy("rating")}
                  className={
                    sortBy === "rating" ? "bg-florida-ocean text-white" : ""
                  }
                >
                  Rating
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gas Stations List */}
        <div className="space-y-4">
          {sortedStations.map((station, index) => (
            <Card key={station.id} className="border-florida-ocean/20">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{station.name}</h3>
                      {index === 0 && sortBy === "price" && (
                        <Badge className="bg-florida-coral text-white text-xs">
                          Cheapest
                        </Badge>
                      )}
                      {station.distance <= 0.5 && (
                        <Badge
                          variant="outline"
                          className="text-xs border-florida-palm text-florida-palm"
                        >
                          Nearby
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {station.address}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Navigation className="w-3 h-3" />
                        {station.distance} miles away
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {station.hours}
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span>{station.rating}</span>
                        <span className="text-muted-foreground">
                          • Updated {station.lastUpdated}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {station.amenities.map((amenity, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="text-right ml-4">
                    <div className="text-2xl font-bold text-florida-ocean">
                      ${station.price.toFixed(3)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      per gallon
                    </div>

                    {station.price === cheapestPrice && (
                      <div className="text-xs text-florida-coral font-semibold mt-1">
                        Save ${((avgPrice - station.price) * 15).toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2 mt-4">
                  <Button
                    className="flex-1 bg-florida-ocean hover:bg-florida-ocean-dark text-white"
                    onClick={() => {
                      // In real app, would open navigation app
                      alert(`Navigate to ${station.name}`);
                    }}
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Navigate
                  </Button>
                  <Button
                    variant="outline"
                    className="border-florida-ocean text-florida-ocean hover:bg-florida-ocean hover:text-white"
                    onClick={() => {
                      // In real app, would make phone call
                      alert(`Call ${station.name}`);
                    }}
                  >
                    <Phone className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tips */}
        <Card className="border-florida-sunset/20 bg-gradient-to-r from-white to-florida-sunset-light/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Fuel className="w-5 h-5 text-florida-sunset" />
              Fuel Saving Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-white/60 rounded-lg">
              <div className="font-semibold text-sm text-florida-sunset">
                ⛽ Fill up during off-peak hours
              </div>
              <div className="text-xs text-muted-foreground">
                Gas is typically cheaper early morning or late evening
              </div>
            </div>
            <div className="p-3 bg-white/60 rounded-lg">
              <div className="font-semibold text-sm text-florida-ocean">
                💳 Use gas station apps
              </div>
              <div className="text-xs text-muted-foreground">
                Many stations offer app-exclusive discounts and rewards
              </div>
            </div>
            <div className="p-3 bg-white/60 rounded-lg">
              <div className="font-semibold text-sm text-florida-palm">
                📍 Plan your route
              </div>
              <div className="text-xs text-muted-foreground">
                Fill up near high-demand areas to minimize detours
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
