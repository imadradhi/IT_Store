// Types matching the actual Firebase database structure
export interface Device {
  id: string;          // Firebase key (A001, A002, etc.)
  Code: string;
  Id: string;
  Location: string;
  MaintenanceDate: string;
  Model: string;
  Name: string;
  Note: string;
  ReceiptForm: string;
  RequiredMaintenanceDate: string;
  UpdatedBy: string;
}

export interface InventoryStats {
  totalDevices: number;
  withNotes: number;
  locations: number;
}
