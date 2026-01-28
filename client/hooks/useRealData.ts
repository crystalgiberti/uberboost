import { useState, useEffect } from "react";
import { xhrUsersAPI, xhrRidesAPI, xhrVehicleAPI } from "../services/xhrApi";

export interface DashboardData {
  todayEarnings: number;
  weekEarnings: number;
  monthEarnings: number;
  todayRides: number;
  weekRides: number;
  monthRides: number;
  dailyGoal: number;
  weeklyGoal: number;
  vehicles: any[];
  recentRides: any[];
}

export function useRealData() {
  const [data, setData] = useState<DashboardData>({
    todayEarnings: 0,
    weekEarnings: 0,
    monthEarnings: 0,
    todayRides: 0,
    weekRides: 0,
    monthRides: 0,
    dailyGoal: 150,
    weeklyGoal: 1000,
    vehicles: [],
    recentRides: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load all data in parallel
      const [dashboard, rideStats, vehicles, rides] = await Promise.allSettled([
        xhrUsersAPI.getDashboard(),
        xhrRidesAPI.getRideStats(),
        xhrVehicleAPI.getVehicles(),
        xhrRidesAPI.getRides(1, 10), // Get recent 10 rides
      ]);

      // Process dashboard data
      const dashboardData =
        dashboard.status === "fulfilled" ? dashboard.value : {};
      const rideStatsData =
        rideStats.status === "fulfilled" ? rideStats.value : {};
      const vehiclesData =
        vehicles.status === "fulfilled" ? vehicles.value : [];
      const ridesData =
        rides.status === "fulfilled" ? rides.value : { rides: [] };

      setData({
        todayEarnings: rideStatsData.todayEarnings || 0,
        weekEarnings: rideStatsData.weekEarnings || 0,
        monthEarnings: rideStatsData.monthEarnings || 0,
        todayRides: rideStatsData.todayRides || 0,
        weekRides: rideStatsData.weekRides || 0,
        monthRides: rideStatsData.monthRides || 0,
        dailyGoal: dashboardData.settings?.dailyGoal || 150,
        weeklyGoal: dashboardData.settings?.weeklyGoal || 1000,
        vehicles: vehiclesData,
        recentRides: ridesData.rides || [],
      });
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      setError("Failed to load data. Using demo data.");

      // Set demo data if API fails
      setData({
        todayEarnings: 87.5,
        weekEarnings: 425.75,
        monthEarnings: 1835.2,
        todayRides: 12,
        weekRides: 58,
        monthRides: 247,
        dailyGoal: 150,
        weeklyGoal: 1000,
        vehicles: [],
        recentRides: [],
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    data,
    isLoading,
    error,
    refresh: loadData,
  };
}

// Hook for vehicle-specific data
export function useVehicleData() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadVehicles = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const vehicleData = await xhrVehicleAPI.getVehicles();
      setVehicles(vehicleData);
    } catch (err) {
      console.error("Failed to load vehicles:", err);
      setError("Failed to load vehicles");
      setVehicles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addVehicle = async (vehicleData: any) => {
    try {
      const newVehicle = await xhrVehicleAPI.createVehicle(vehicleData);
      setVehicles((prev) => [...prev, newVehicle]);
      return newVehicle;
    } catch (err) {
      console.error("Failed to add vehicle:", err);
      throw err;
    }
  };

  const updateVehicle = async (id: string, vehicleData: any) => {
    try {
      const updatedVehicle = await xhrVehicleAPI.updateVehicle(id, vehicleData);
      setVehicles((prev) =>
        prev.map((v) => (v.id === id ? updatedVehicle : v)),
      );
      return updatedVehicle;
    } catch (err) {
      console.error("Failed to update vehicle:", err);
      throw err;
    }
  };

  const deleteVehicle = async (id: string) => {
    try {
      await xhrVehicleAPI.deleteVehicle(id);
      setVehicles((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      console.error("Failed to delete vehicle:", err);
      throw err;
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  return {
    vehicles,
    isLoading,
    error,
    refresh: loadVehicles,
    addVehicle,
    updateVehicle,
    deleteVehicle,
  };
}
