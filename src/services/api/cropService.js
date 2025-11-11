import { getApperClient } from "@/services/apperClient";

const cropService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return [];
      }

      const response = await apperClient.fetchRecords('crops_c', {
        fields: [
          {"field": {"Name": "cropType_c"}},
          {"field": {"Name": "fieldLocation_c"}},
          {"field": {"Name": "plantingDate_c"}},
          {"field": {"Name": "expectedHarvestDate_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "farmId_c"}, "referenceField": {"field": {"Name": "name_c"}}}
        ]
      });

      if (!response.success) {
        console.error("Crops fetch failed:", response.message);
        return [];
      }

      return response.data.map(item => ({
        Id: item.Id,
        farmId: item.farmId_c?.Id?.toString() || "",
        cropType: item.cropType_c || "",
        fieldLocation: item.fieldLocation_c || "",
        plantingDate: item.plantingDate_c,
        expectedHarvestDate: item.expectedHarvestDate_c,
        status: item.status_c || "Planted",
        notes: item.notes_c || ""
      }));
    } catch (error) {
      console.error("Crops service error:", error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return null;
      }

      const response = await apperClient.getRecordById('crops_c', parseInt(id), {
        fields: [
          {"field": {"Name": "cropType_c"}},
          {"field": {"Name": "fieldLocation_c"}},
          {"field": {"Name": "plantingDate_c"}},
          {"field": {"Name": "expectedHarvestDate_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "farmId_c"}, "referenceField": {"field": {"Name": "name_c"}}}
        ]
      });

      if (!response.success) {
        console.error(`Crop ${id} fetch failed:`, response.message);
        return null;
      }

      const item = response.data;
      return {
        Id: item.Id,
        farmId: item.farmId_c?.Id?.toString() || "",
        cropType: item.cropType_c || "",
        fieldLocation: item.fieldLocation_c || "",
        plantingDate: item.plantingDate_c,
        expectedHarvestDate: item.expectedHarvestDate_c,
        status: item.status_c || "Planted",
        notes: item.notes_c || ""
      };
    } catch (error) {
      console.error("Crop getById service error:", error);
      return null;
    }
  },

  async getByFarmId(farmId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return [];
      }

      const response = await apperClient.fetchRecords('crops_c', {
        fields: [
          {"field": {"Name": "cropType_c"}},
          {"field": {"Name": "fieldLocation_c"}},
          {"field": {"Name": "plantingDate_c"}},
          {"field": {"Name": "expectedHarvestDate_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "farmId_c"}, "referenceField": {"field": {"Name": "name_c"}}}
        ],
        where: [{
          "FieldName": "farmId_c",
          "Operator": "EqualTo",
          "Values": [parseInt(farmId)]
        }]
      });

      if (!response.success) {
        console.error("Crops by farm fetch failed:", response.message);
        return [];
      }

      return response.data.map(item => ({
        Id: item.Id,
        farmId: item.farmId_c?.Id?.toString() || "",
        cropType: item.cropType_c || "",
        fieldLocation: item.fieldLocation_c || "",
        plantingDate: item.plantingDate_c,
        expectedHarvestDate: item.expectedHarvestDate_c,
        status: item.status_c || "Planted",
        notes: item.notes_c || ""
      }));
    } catch (error) {
      console.error("Crops by farmId service error:", error);
      return [];
    }
  },

  async create(cropData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        throw new Error("Database connection unavailable");
      }

      const params = {
        records: [{
          farmId_c: parseInt(cropData.farmId),
          cropType_c: cropData.cropType,
          fieldLocation_c: cropData.fieldLocation,
          plantingDate_c: cropData.plantingDate,
          expectedHarvestDate_c: cropData.expectedHarvestDate,
          status_c: cropData.status,
          notes_c: cropData.notes || ""
        }]
      };

      const response = await apperClient.createRecord('crops_c', params);

      if (!response.success) {
        console.error("Crop creation failed:", response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const created = response.results[0];
        if (created.success) {
          return {
            Id: created.data.Id,
            farmId: cropData.farmId,
            cropType: cropData.cropType,
            fieldLocation: cropData.fieldLocation,
            plantingDate: cropData.plantingDate,
            expectedHarvestDate: cropData.expectedHarvestDate,
            status: cropData.status,
            notes: cropData.notes || ""
          };
        } else {
          throw new Error(created.message || "Failed to create crop");
        }
      }

      throw new Error("No results returned from crop creation");
    } catch (error) {
      console.error("Crop creation service error:", error);
      throw error;
    }
  },

  async update(id, cropData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        throw new Error("Database connection unavailable");
      }

      const params = {
        records: [{
          Id: parseInt(id),
          farmId_c: parseInt(cropData.farmId),
          cropType_c: cropData.cropType,
          fieldLocation_c: cropData.fieldLocation,
          plantingDate_c: cropData.plantingDate,
          expectedHarvestDate_c: cropData.expectedHarvestDate,
          status_c: cropData.status,
          notes_c: cropData.notes || ""
        }]
      };

      const response = await apperClient.updateRecord('crops_c', params);

      if (!response.success) {
        console.error("Crop update failed:", response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const updated = response.results[0];
        if (updated.success) {
          return {
            Id: parseInt(id),
            farmId: cropData.farmId,
            cropType: cropData.cropType,
            fieldLocation: cropData.fieldLocation,
            plantingDate: cropData.plantingDate,
            expectedHarvestDate: cropData.expectedHarvestDate,
            status: cropData.status,
            notes: cropData.notes || ""
          };
        } else {
          throw new Error(updated.message || "Failed to update crop");
        }
      }

      throw new Error("No results returned from crop update");
    } catch (error) {
      console.error("Crop update service error:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        throw new Error("Database connection unavailable");
      }

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('crops_c', params);

      if (!response.success) {
        console.error("Crop deletion failed:", response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const deleted = response.results[0];
        if (deleted.success) {
          return { Id: parseInt(id) };
        } else {
          throw new Error(deleted.message || "Failed to delete crop");
        }
      }

      throw new Error("No results returned from crop deletion");
    } catch (error) {
      console.error("Crop deletion service error:", error);
      throw error;
    }
  }
};

export default cropService;

export default cropService;