import { database } from '../firebase';
import { ref, get, set, update, remove, onValue, push } from 'firebase/database';
import type { Device, InventoryStats } from '../types/device';

const ASSETS_PATH = 'assets';

// Get all devices
export async function getDevices(): Promise<Device[]> {
  try {
    const dbRef = ref(database, ASSETS_PATH);
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.keys(data).map(key => ({ id: key, ...data[key] }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching assets:', error);
    throw error;
  }
}

// Add new device
export async function addDevice(device: Omit<Device, 'id'>): Promise<string> {
  try {
    const dbRef = ref(database, ASSETS_PATH);
    const newRef = push(dbRef);
    await set(newRef, { ...device });
    return newRef.key || '';
  } catch (error) {
    console.error('Error adding asset:', error);
    throw error;
  }
}

// Update device
export async function updateDevice(id: string, updates: Partial<Device>): Promise<void> {
  try {
    const dbRef = ref(database, `${ASSETS_PATH}/${id}`);
    await update(dbRef, { ...updates });
  } catch (error) {
    console.error('Error updating asset:', error);
    throw error;
  }
}

// Delete device
export async function deleteDevice(id: string): Promise<void> {
  try {
    const dbRef = ref(database, `${ASSETS_PATH}/${id}`);
    await remove(dbRef);
  } catch (error) {
    console.error('Error deleting asset:', error);
    throw error;
  }
}

// Subscribe to real-time updates
export function subscribeToDevices(
  callback: (devices: Device[]) => void,
  errorCallback?: (error: Error) => void
): () => void {
  const dbRef = ref(database, ASSETS_PATH);

  const unsubscribe = onValue(
    dbRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const devices = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        callback(devices);
      } else {
        callback([]);
      }
    },
    (error) => {
      console.error('Firebase permission error:', error);
      if (errorCallback) errorCallback(error);
    }
  );

  return unsubscribe;
}

// Calculate inventory stats
export function calculateStats(devices: Device[]): InventoryStats {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const inventoriedLastMonth = devices.filter(d => 
    d.MaintenanceDate && new Date(d.MaintenanceDate) >= thirtyDaysAgo
  ).length;

  const needsInventory = devices.length - inventoriedLastMonth;

  return {
    totalDevices: devices.length,
    inventoriedLastMonth,
    needsInventory,
  };
}
