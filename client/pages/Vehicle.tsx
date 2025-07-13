import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVehicleData } from "../hooks/useRealData";
import {
  ArrowLeft,
  Car,
  Fuel,
  Wrench,
  Calendar,
  DollarSign,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Vehicle {
  id: string;
  year: number;
  make: string;
  model: string;
  color: string;
  licensePlate: string;
  mileage: number;
  fuelType: "gas" | "hybrid" | "electric";
  mpg: number;
  isActive: boolean;
}

interface MaintenanceRecord {
  id: string;
  type: "oil_change" | "tire_rotation" | "inspection" | "repair" | "other";
  description: string;
  date: string;
  mileage: number;
  cost: number;
  location: string;
  nextDue?: number;
}

export default function Vehicle() {
  const navigate = useNavigate();
  const { vehicles, isLoading, error, addVehicle, deleteVehicle } =
    useVehicleData();

  const [maintenanceRecords, setMaintenanceRecords] = useState<
    MaintenanceRecord[]
  >([
    {
      id: "1",
      type: "oil_change",
      description: "Full synthetic oil change",
      date: "2024-11-15",
      mileage: 44500,
      cost: 45,
      location: "Quick Lube Plus",
      nextDue: 47500,
    },
    {
      id: "2",
      type: "inspection",
      description: "Annual safety inspection",
      date: "2024-10-01",
      mileage: 44000,
      cost: 25,
      location: "Florida DMV",
    },
  ]);

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [showAddMaintenance, setShowAddMaintenance] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    year: new Date().getFullYear(),
    make: "",
    model: "",
    color: "",
    licensePlate: "",
    mileage: 0,
    fuelType: "gas" as "gas" | "hybrid" | "electric",
    mpg: 25,
    isActive: true,
  });

  // Load vehicles from API
  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      setIsLoading(true);
      const vehicleData = await xhrVehicleAPI.getVehicles();
      setVehicles(vehicleData);
      if (vehicleData.length > 0 && !selectedVehicle) {
        setSelectedVehicle(vehicleData[0]);
      }
    } catch (err) {
      setError("Failed to load vehicles");
      console.error("Load vehicles error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddVehicle = async () => {
    try {
      setIsLoading(true);
      const createdVehicle = await xhrVehicleAPI.createVehicle(newVehicle);
      await loadVehicles(); // Reload vehicles
      setShowAddVehicle(false);
      setSelectedVehicle(createdVehicle);
      // Reset form
      setNewVehicle({
        year: new Date().getFullYear(),
        make: "",
        model: "",
        color: "",
        licensePlate: "",
        mileage: 0,
        fuelType: "gas",
        mpg: 25,
        isActive: true,
      });
    } catch (err) {
      setError("Failed to add vehicle");
      console.error("Add vehicle error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    if (!confirm("Are you sure you want to delete this vehicle?")) return;

    try {
      await xhrVehicleAPI.deleteVehicle(vehicleId);
      await loadVehicles();
      if (selectedVehicle?.id === vehicleId) {
        setSelectedVehicle(
          vehicles.length > 1
            ? vehicles.find((v) => v.id !== vehicleId) || null
            : null,
        );
      }
    } catch (err) {
      setError("Failed to delete vehicle");
      console.error("Delete vehicle error:", err);
    }
  };

  const getMaintenanceIcon = (type: string) => {
    switch (type) {
      case "oil_change":
        return "🛢️";
      case "tire_rotation":
        return "🔄";
      case "inspection":
        return "🔍";
      case "repair":
        return "����";
      default:
        return "⚙️";
    }
  };

  const getMaintenanceColor = (type: string) => {
    switch (type) {
      case "oil_change":
        return "bg-blue-100 text-blue-800";
      case "tire_rotation":
        return "bg-green-100 text-green-800";
      case "inspection":
        return "bg-orange-100 text-orange-800";
      case "repair":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getUpcomingMaintenance = () => {
    if (!selectedVehicle) return [];

    const upcoming = [];
    const currentMileage = selectedVehicle.mileage;

    // Oil change every 3000 miles
    const lastOilChange = maintenanceRecords
      .filter((r) => r.type === "oil_change")
      .sort((a, b) => b.mileage - a.mileage)[0];

    if (lastOilChange) {
      const nextOilChange =
        lastOilChange.nextDue || lastOilChange.mileage + 3000;
      if (nextOilChange - currentMileage <= 500) {
        upcoming.push({
          type: "Oil Change",
          due: nextOilChange,
          urgent: nextOilChange - currentMileage <= 100,
        });
      }
    }

    // Annual inspection
    const lastInspection = maintenanceRecords
      .filter((r) => r.type === "inspection")
      .sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      )[0];

    if (lastInspection) {
      const inspectionDate = new Date(lastInspection.date);
      const nextInspection = new Date(
        inspectionDate.setFullYear(inspectionDate.getFullYear() + 1),
      );
      const daysUntil = Math.ceil(
        (nextInspection.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
      );

      if (daysUntil <= 30) {
        upcoming.push({
          type: "Safety Inspection",
          due: `${daysUntil} days`,
          urgent: daysUntil <= 7,
        });
      }
    }

    return upcoming;
  };

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
                Vehicle Management
              </h1>
              <p className="text-xs text-muted-foreground">
                Track cars & maintenance
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddVehicle(true)}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Vehicle
          </Button>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Vehicle Selector */}
        {vehicles.length > 1 && (
          <Card className="border-florida-ocean/20">
            <CardContent className="p-4">
              <Label htmlFor="vehicle-select">Select Vehicle</Label>
              <Select
                value={selectedVehicle?.id}
                onValueChange={(id) => {
                  const vehicle = vehicles.find((v) => v.id === id);
                  setSelectedVehicle(vehicle || null);
                }}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.year} {vehicle.make} {vehicle.model} (
                      {vehicle.licensePlate})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        )}

        {selectedVehicle && (
          <>
            {/* Vehicle Overview */}
            <Card className="border-florida-ocean/20 bg-gradient-to-r from-white to-florida-ocean/10">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Car className="w-5 h-5 text-florida-ocean" />
                    {selectedVehicle.year} {selectedVehicle.make}{" "}
                    {selectedVehicle.model}
                  </span>
                  <Badge
                    className={
                      selectedVehicle.isActive
                        ? "bg-green-500 text-white"
                        : "bg-gray-500 text-white"
                    }
                  >
                    {selectedVehicle.isActive ? "Active" : "Inactive"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-florida-ocean">
                      {selectedVehicle.color}
                    </div>
                    <div className="text-xs text-muted-foreground">Color</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-florida-ocean">
                      {selectedVehicle.licensePlate}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      License Plate
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-florida-ocean">
                      {selectedVehicle.mileage.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">Miles</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-florida-ocean">
                      {selectedVehicle.mpg} MPG
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Fuel Economy
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Maintenance Alerts */}
            {getUpcomingMaintenance().length > 0 && (
              <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-orange-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    Upcoming Maintenance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {getUpcomingMaintenance().map((item, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        item.urgent
                          ? "bg-red-50 border-red-200"
                          : "bg-yellow-50 border-yellow-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div
                            className={`font-semibold ${
                              item.urgent ? "text-red-800" : "text-yellow-800"
                            }`}
                          >
                            {item.type}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Due: {item.due}
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Schedule
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="border-florida-palm/20">
                <CardContent className="p-4 text-center">
                  <Fuel className="w-8 h-8 text-florida-palm mx-auto mb-2" />
                  <div className="text-2xl font-bold text-florida-palm">
                    $
                    {(
                      (selectedVehicle.mileage / selectedVehicle.mpg) *
                      3.5
                    ).toFixed(0)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Est. Fuel Cost
                  </div>
                </CardContent>
              </Card>
              <Card className="border-florida-sunset/20">
                <CardContent className="p-4 text-center">
                  <Wrench className="w-8 h-8 text-florida-sunset mx-auto mb-2" />
                  <div className="text-2xl font-bold text-florida-sunset">
                    {maintenanceRecords.length}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Service Records
                  </div>
                </CardContent>
              </Card>
              <Card className="border-florida-ocean/20">
                <CardContent className="p-4 text-center">
                  <Calendar className="w-8 h-8 text-florida-ocean mx-auto mb-2" />
                  <div className="text-2xl font-bold text-florida-ocean">
                    {Math.ceil(
                      (Date.now() -
                        new Date(
                          maintenanceRecords[0]?.date || Date.now(),
                        ).getTime()) /
                        (1000 * 60 * 60 * 24),
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Days Since Service
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Maintenance History */}
            <Card className="border-florida-sunset/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-florida-sunset" />
                    Maintenance History
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddMaintenance(true)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Record
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {maintenanceRecords
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime(),
                  )
                  .map((record) => (
                    <div
                      key={record.id}
                      className="p-4 bg-white/50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">
                              {getMaintenanceIcon(record.type)}
                            </span>
                            <span className="font-semibold">
                              {record.description}
                            </span>
                            <Badge className={getMaintenanceColor(record.type)}>
                              {record.type.replace("_", " ")}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(record.date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {record.location}
                            </span>
                            <span>{record.mileage.toLocaleString()} miles</span>
                          </div>
                          {record.nextDue && (
                            <div className="text-xs text-green-600 mt-1">
                              Next due: {record.nextDue.toLocaleString()} miles
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-florida-sunset">
                            ${record.cost.toFixed(2)}
                          </div>
                          <div className="flex gap-1 mt-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                {maintenanceRecords.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Wrench className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>
                      No maintenance records yet. Add your first service record!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {vehicles.length === 0 && (
          <Card className="border-gray-200">
            <CardContent className="p-8 text-center">
              <Car className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">No Vehicles Added</h3>
              <p className="text-muted-foreground mb-4">
                Add your first vehicle to start tracking maintenance and costs.
              </p>
              <Button
                onClick={() => setShowAddVehicle(true)}
                className="bg-florida-ocean hover:bg-florida-ocean-dark text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Vehicle
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Add Vehicle Modal */}
        {showAddVehicle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">Add New Vehicle</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      type="number"
                      value={newVehicle.year}
                      onChange={(e) =>
                        setNewVehicle({
                          ...newVehicle,
                          year: parseInt(e.target.value),
                        })
                      }
                      min="1990"
                      max={new Date().getFullYear() + 1}
                    />
                  </div>
                  <div>
                    <Label htmlFor="make">Make</Label>
                    <Input
                      id="make"
                      value={newVehicle.make}
                      onChange={(e) =>
                        setNewVehicle({ ...newVehicle, make: e.target.value })
                      }
                      placeholder="Honda, Toyota, etc."
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    value={newVehicle.model}
                    onChange={(e) =>
                      setNewVehicle({ ...newVehicle, model: e.target.value })
                    }
                    placeholder="Civic, Camry, etc."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="color">Color</Label>
                    <Input
                      id="color"
                      value={newVehicle.color}
                      onChange={(e) =>
                        setNewVehicle({ ...newVehicle, color: e.target.value })
                      }
                      placeholder="Silver, Black, etc."
                    />
                  </div>
                  <div>
                    <Label htmlFor="licensePlate">License Plate</Label>
                    <Input
                      id="licensePlate"
                      value={newVehicle.licensePlate}
                      onChange={(e) =>
                        setNewVehicle({
                          ...newVehicle,
                          licensePlate: e.target.value,
                        })
                      }
                      placeholder="ABC-1234"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="mileage">Current Mileage</Label>
                    <Input
                      id="mileage"
                      type="number"
                      value={newVehicle.mileage}
                      onChange={(e) =>
                        setNewVehicle({
                          ...newVehicle,
                          mileage: parseInt(e.target.value),
                        })
                      }
                      min="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mpg">MPG</Label>
                    <Input
                      id="mpg"
                      type="number"
                      value={newVehicle.mpg}
                      onChange={(e) =>
                        setNewVehicle({
                          ...newVehicle,
                          mpg: parseInt(e.target.value),
                        })
                      }
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="fuelType">Fuel Type</Label>
                  <Select
                    value={newVehicle.fuelType}
                    onValueChange={(value: "gas" | "hybrid" | "electric") =>
                      setNewVehicle({ ...newVehicle, fuelType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gas">Gas</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                      <SelectItem value="electric">Electric</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {error && <div className="text-red-600 text-sm">{error}</div>}

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => setShowAddVehicle(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddVehicle}
                    disabled={
                      isLoading || !newVehicle.make || !newVehicle.model
                    }
                    className="flex-1 bg-florida-ocean hover:bg-florida-ocean-dark text-white"
                  >
                    {isLoading ? "Adding..." : "Add Vehicle"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
