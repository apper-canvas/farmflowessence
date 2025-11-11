import { getApperClient } from "@/services/apperClient";

const farmService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return [];
      }

      const response = await apperClient.fetchRecords('farms_c', {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "sizeUnit_c"}}
        ]
      });

      if (!response.success) {
        console.error("Farms fetch failed:", response.message);
        return [];
      }

      return response.data.map(item => ({
        Id: item.Id,
        name: item.name_c || "",
        location: item.location_c || "",
        size: item.size_c || 0,
        sizeUnit: item.sizeUnit_c || "acres"
      }));
    } catch (error) {
      console.error("Farms service error:", error);
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

      const response = await apperClient.getRecordById('farms_c', parseInt(id), {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "sizeUnit_c"}}
        ]
      });

      if (!response.success) {
        console.error(`Farm ${id} fetch failed:`, response.message);
        return null;
      }

      const item = response.data;
      return {
        Id: item.Id,
        name: item.name_c || "",
        location: item.location_c || "",
        size: item.size_c || 0,
        sizeUnit: item.sizeUnit_c || "acres"
      };
    } catch (error) {
      console.error("Farm getById service error:", error);
      return null;
    }
  },

  async create(farmData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        throw new Error("Database connection unavailable");
      }

      const params = {
        records: [{
          name_c: farmData.name,
          location_c: farmData.location,
          size_c: farmData.size,
          sizeUnit_c: farmData.sizeUnit
        }]
      };

      const response = await apperClient.createRecord('farms_c', params);

      if (!response.success) {
        console.error("Farm creation failed:", response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const created = response.results[0];
        if (created.success) {
          return {
            Id: created.data.Id,
            name: farmData.name,
            location: farmData.location,
            size: farmData.size,
            sizeUnit: farmData.sizeUnit
          };
        } else {
          throw new Error(created.message || "Failed to create farm");
        }
      }

      throw new Error("No results returned from farm creation");
    } catch (error) {
      console.error("Farm creation service error:", error);
      throw error;
    }
  },

  async update(id, farmData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        throw new Error("Database connection unavailable");
      }

      const params = {
        records: [{
          Id: parseInt(id),
          name_c: farmData.name,
          location_c: farmData.location,
          size_c: farmData.size,
          sizeUnit_c: farmData.sizeUnit
        }]
      };

      const response = await apperClient.updateRecord('farms_c', params);

      if (!response.success) {
        console.error("Farm update failed:", response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const updated = response.results[0];
        if (updated.success) {
          return {
            Id: parseInt(id),
            name: farmData.name,
            location: farmData.location,
            size: farmData.size,
            sizeUnit: farmData.sizeUnit
          };
        } else {
          throw new Error(updated.message || "Failed to update farm");
        }
      }

      throw new Error("No results returned from farm update");
    } catch (error) {
      console.error("Farm update service error:", error);
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

      const response = await apperClient.deleteRecord('farms_c', params);

      if (!response.success) {
        console.error("Farm deletion failed:", response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const deleted = response.results[0];
        if (deleted.success) {
          return { Id: parseInt(id) };
        } else {
          throw new Error(deleted.message || "Failed to delete farm");
        }
      }

      throw new Error("No results returned from farm deletion");
    } catch (error) {
      console.error("Farm deletion service error:", error);
      throw error;
    }
  }
};

export default farmService;