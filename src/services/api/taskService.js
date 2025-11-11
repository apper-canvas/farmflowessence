import { getApperClient } from "@/services/apperClient";

const taskService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return [];
      }

      const response = await apperClient.fetchRecords('tasks_c', {
        fields: [
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "dueDate_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "recurring_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "farmId_c"}, "referenceField": {"field": {"Name": "name_c"}}}
        ],
        orderBy: [{"fieldName": "dueDate_c", "sorttype": "ASC"}]
      });

      if (!response.success) {
        console.error("Tasks fetch failed:", response.message);
        return [];
      }

      return response.data.map(item => ({
        Id: item.Id,
        farmId: item.farmId_c?.Id?.toString() || "",
        title: item.title_c || "",
        description: item.description_c || "",
        dueDate: item.dueDate_c,
        priority: item.priority_c || "medium",
        recurring: item.recurring_c || false,
        completed: item.completed_c || false
      }));
    } catch (error) {
      console.error("Tasks service error:", error);
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

      const response = await apperClient.getRecordById('tasks_c', parseInt(id), {
        fields: [
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "dueDate_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "recurring_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "farmId_c"}, "referenceField": {"field": {"Name": "name_c"}}}
        ]
      });

      if (!response.success) {
        console.error(`Task ${id} fetch failed:`, response.message);
        return null;
      }

      const item = response.data;
      return {
        Id: item.Id,
        farmId: item.farmId_c?.Id?.toString() || "",
        title: item.title_c || "",
        description: item.description_c || "",
        dueDate: item.dueDate_c,
        priority: item.priority_c || "medium",
        recurring: item.recurring_c || false,
        completed: item.completed_c || false
      };
    } catch (error) {
      console.error("Task getById service error:", error);
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

      const response = await apperClient.fetchRecords('tasks_c', {
        fields: [
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "dueDate_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "recurring_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "farmId_c"}, "referenceField": {"field": {"Name": "name_c"}}}
        ],
        where: [{
          "FieldName": "farmId_c",
          "Operator": "EqualTo",
          "Values": [parseInt(farmId)]
        }]
      });

      if (!response.success) {
        console.error("Tasks by farm fetch failed:", response.message);
        return [];
      }

      return response.data.map(item => ({
        Id: item.Id,
        farmId: item.farmId_c?.Id?.toString() || "",
        title: item.title_c || "",
        description: item.description_c || "",
        dueDate: item.dueDate_c,
        priority: item.priority_c || "medium",
        recurring: item.recurring_c || false,
        completed: item.completed_c || false
      }));
    } catch (error) {
      console.error("Tasks by farmId service error:", error);
      return [];
    }
  },

  async getUpcoming() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return [];
      }

      const now = new Date().toISOString();
      const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

      const response = await apperClient.fetchRecords('tasks_c', {
        fields: [
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "dueDate_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "recurring_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "farmId_c"}, "referenceField": {"field": {"Name": "name_c"}}}
        ],
        where: [
          {
            "FieldName": "completed_c",
            "Operator": "EqualTo",
            "Values": [false]
          },
          {
            "FieldName": "dueDate_c",
            "Operator": "GreaterThanOrEqualTo",
            "Values": [now]
          },
          {
            "FieldName": "dueDate_c",
            "Operator": "LessThanOrEqualTo", 
            "Values": [nextWeek]
          }
        ],
        orderBy: [{"fieldName": "dueDate_c", "sorttype": "ASC"}]
      });

      if (!response.success) {
        console.error("Upcoming tasks fetch failed:", response.message);
        return [];
      }

      return response.data.map(item => ({
        Id: item.Id,
        farmId: item.farmId_c?.Id?.toString() || "",
        title: item.title_c || "",
        description: item.description_c || "",
        dueDate: item.dueDate_c,
        priority: item.priority_c || "medium",
        recurring: item.recurring_c || false,
        completed: item.completed_c || false
      }));
    } catch (error) {
      console.error("Upcoming tasks service error:", error);
      return [];
    }
  },

  async create(taskData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        throw new Error("Database connection unavailable");
      }

      const params = {
        records: [{
          farmId_c: parseInt(taskData.farmId),
          title_c: taskData.title,
          description_c: taskData.description,
          dueDate_c: taskData.dueDate,
          priority_c: taskData.priority,
          recurring_c: taskData.recurring || false,
          completed_c: false
        }]
      };

      const response = await apperClient.createRecord('tasks_c', params);

      if (!response.success) {
        console.error("Task creation failed:", response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const created = response.results[0];
        if (created.success) {
          return {
            Id: created.data.Id,
            farmId: taskData.farmId,
            title: taskData.title,
            description: taskData.description,
            dueDate: taskData.dueDate,
            priority: taskData.priority,
            recurring: taskData.recurring || false,
            completed: false
          };
        } else {
          throw new Error(created.message || "Failed to create task");
        }
      }

      throw new Error("No results returned from task creation");
    } catch (error) {
      console.error("Task creation service error:", error);
      throw error;
    }
  },

  async update(id, taskData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        throw new Error("Database connection unavailable");
      }

      const params = {
        records: [{
          Id: parseInt(id),
          farmId_c: parseInt(taskData.farmId),
          title_c: taskData.title,
          description_c: taskData.description,
          dueDate_c: taskData.dueDate,
          priority_c: taskData.priority,
          recurring_c: taskData.recurring || false,
          completed_c: taskData.completed || false
        }]
      };

      const response = await apperClient.updateRecord('tasks_c', params);

      if (!response.success) {
        console.error("Task update failed:", response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const updated = response.results[0];
        if (updated.success) {
          return {
            Id: parseInt(id),
            farmId: taskData.farmId,
            title: taskData.title,
            description: taskData.description,
            dueDate: taskData.dueDate,
            priority: taskData.priority,
            recurring: taskData.recurring || false,
            completed: taskData.completed || false
          };
        } else {
          throw new Error(updated.message || "Failed to update task");
        }
      }

      throw new Error("No results returned from task update");
    } catch (error) {
      console.error("Task update service error:", error);
      throw error;
    }
  },

  async toggleComplete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        throw new Error("Database connection unavailable");
      }

      // First get the current task to toggle its completion status
      const currentTask = await this.getById(id);
      if (!currentTask) {
        throw new Error("Task not found");
      }

      const params = {
        records: [{
          Id: parseInt(id),
          completed_c: !currentTask.completed
        }]
      };

      const response = await apperClient.updateRecord('tasks_c', params);

      if (!response.success) {
        console.error("Task toggle failed:", response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const updated = response.results[0];
        if (updated.success) {
          return {
            ...currentTask,
            completed: !currentTask.completed
          };
        } else {
          throw new Error(updated.message || "Failed to toggle task completion");
        }
      }

      throw new Error("No results returned from task toggle");
    } catch (error) {
      console.error("Task toggle service error:", error);
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

      const response = await apperClient.deleteRecord('tasks_c', params);

      if (!response.success) {
        console.error("Task deletion failed:", response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const deleted = response.results[0];
        if (deleted.success) {
          return { Id: parseInt(id) };
        } else {
          throw new Error(deleted.message || "Failed to delete task");
        }
      }

      throw new Error("No results returned from task deletion");
    } catch (error) {
      console.error("Task deletion service error:", error);
      throw error;
    }
  }
};

export default taskService;