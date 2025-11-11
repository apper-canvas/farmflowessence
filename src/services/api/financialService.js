import { getApperClient } from "@/services/apperClient";

const financialService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return [];
      }

      const response = await apperClient.fetchRecords('financialEntries_c', {
        fields: [
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "farmId_c"}, "referenceField": {"field": {"Name": "name_c"}}}
        ],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error("Financial entries fetch failed:", response.message);
        return [];
      }

      return response.data.map(item => ({
        Id: item.Id,
        farmId: item.farmId_c?.Id?.toString() || "",
        type: item.type_c || "expense",
        amount: item.amount_c || 0,
        category: item.category_c || "",
        description: item.description_c || "",
        date: item.date_c
      }));
    } catch (error) {
      console.error("Financial entries service error:", error);
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

      const response = await apperClient.getRecordById('financialEntries_c', parseInt(id), {
        fields: [
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "farmId_c"}, "referenceField": {"field": {"Name": "name_c"}}}
        ]
      });

      if (!response.success) {
        console.error(`Financial entry ${id} fetch failed:`, response.message);
        return null;
      }

      const item = response.data;
      return {
        Id: item.Id,
        farmId: item.farmId_c?.Id?.toString() || "",
        type: item.type_c || "expense",
        amount: item.amount_c || 0,
        category: item.category_c || "",
        description: item.description_c || "",
        date: item.date_c
      };
    } catch (error) {
      console.error("Financial entry getById service error:", error);
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

      const response = await apperClient.fetchRecords('financialEntries_c', {
        fields: [
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "farmId_c"}, "referenceField": {"field": {"Name": "name_c"}}}
        ],
        where: [{
          "FieldName": "farmId_c",
          "Operator": "EqualTo",
          "Values": [parseInt(farmId)]
        }],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error("Financial entries by farm fetch failed:", response.message);
        return [];
      }

      return response.data.map(item => ({
        Id: item.Id,
        farmId: item.farmId_c?.Id?.toString() || "",
        type: item.type_c || "expense",
        amount: item.amount_c || 0,
        category: item.category_c || "",
        description: item.description_c || "",
        date: item.date_c
      }));
    } catch (error) {
      console.error("Financial entries by farmId service error:", error);
      return [];
    }
  },

  async getSummary() {
    try {
      const entries = await this.getAll();
      
      const summary = entries.reduce((acc, entry) => {
        if (entry.type === "income") {
          acc.totalIncome += entry.amount;
        } else {
          acc.totalExpenses += entry.amount;
        }
        return acc;
      }, { totalIncome: 0, totalExpenses: 0 });

      summary.netBalance = summary.totalIncome - summary.totalExpenses;
      return summary;
    } catch (error) {
      console.error("Financial summary service error:", error);
      return { totalIncome: 0, totalExpenses: 0, netBalance: 0 };
    }
  },

  async create(entryData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        throw new Error("Database connection unavailable");
      }

      const params = {
        records: [{
          farmId_c: parseInt(entryData.farmId),
          type_c: entryData.type,
          amount_c: entryData.amount,
          category_c: entryData.category,
          description_c: entryData.description,
          date_c: entryData.date
        }]
      };

      const response = await apperClient.createRecord('financialEntries_c', params);

      if (!response.success) {
        console.error("Financial entry creation failed:", response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const created = response.results[0];
        if (created.success) {
          return {
            Id: created.data.Id,
            farmId: entryData.farmId,
            type: entryData.type,
            amount: entryData.amount,
            category: entryData.category,
            description: entryData.description,
            date: entryData.date
          };
        } else {
          throw new Error(created.message || "Failed to create financial entry");
        }
      }

      throw new Error("No results returned from financial entry creation");
    } catch (error) {
      console.error("Financial entry creation service error:", error);
      throw error;
    }
  },

  async update(id, entryData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        throw new Error("Database connection unavailable");
      }

      const params = {
        records: [{
          Id: parseInt(id),
          farmId_c: parseInt(entryData.farmId),
          type_c: entryData.type,
          amount_c: entryData.amount,
          category_c: entryData.category,
          description_c: entryData.description,
          date_c: entryData.date
        }]
      };

      const response = await apperClient.updateRecord('financialEntries_c', params);

      if (!response.success) {
        console.error("Financial entry update failed:", response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const updated = response.results[0];
        if (updated.success) {
          return {
            Id: parseInt(id),
            farmId: entryData.farmId,
            type: entryData.type,
            amount: entryData.amount,
            category: entryData.category,
            description: entryData.description,
            date: entryData.date
          };
        } else {
          throw new Error(updated.message || "Failed to update financial entry");
        }
      }

      throw new Error("No results returned from financial entry update");
    } catch (error) {
      console.error("Financial entry update service error:", error);
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

      const response = await apperClient.deleteRecord('financialEntries_c', params);

      if (!response.success) {
        console.error("Financial entry deletion failed:", response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const deleted = response.results[0];
        if (deleted.success) {
          return { Id: parseInt(id) };
        } else {
          throw new Error(deleted.message || "Failed to delete financial entry");
        }
      }

      throw new Error("No results returned from financial entry deletion");
    } catch (error) {
      console.error("Financial entry deletion service error:", error);
      throw error;
    }
  }
};

export default financialService;
export default financialService;