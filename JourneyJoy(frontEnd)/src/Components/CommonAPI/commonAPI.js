// const baseUrl = "https://wise-flea-accurate.ngrok-free.app";
// const baseUrl = "https://marmoset-big-goldfish.ngrok-free.app";
// const baseUrl = "https://enormous-together-mammoth.ngrok-free.app";
// const baseUrl = "https://only-fond-jaguar.ngrok-free.app";
// const baseUrl = "https://mustang-whole-mentally.ngrok-free.app";
// const baseUrl = "https://killdeer-rested-needlessly.ngrok-free.app";
// const baseUrl = "https://quiet-bedbug-social.ngrok-free.app/";
import { URL_SERVER } from "../VanDe/server";
const baseUrl = URL_SERVER;
const token = localStorage.getItem("token");
console.log("<<<<<TOKEN>>>>>>>>", token);
const commonAPI = {
  get: async (path, params) => {
    const url = new URL(`${baseUrl}${path}`);
    url.search = new URLSearchParams(params).toString();

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("SEND TOKEN TO SERVER", token);
      return await response.json();
    } catch (error) {
      console.error("Error in GET request:", error);
      throw error;
    }
  },

  // post: async (path, body) => {
  //   try {
  //     const response = await fetch(`${baseUrl}${path}`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "ngrok-skip-browser-warning": "69420",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify(body),
  //     });
  //     return await response.json();
  //   } catch (error) {
  //     console.error("Error in POST request:", error);
  //     throw error;
  //   }
  // },
  post: async (path, body, isFormData = false) => {
    try {
      const headers = {
        "ngrok-skip-browser-warning": "69420",
        Authorization: `Bearer ${token}`,
      };

      if (!isFormData) {
        headers["Content-Type"] = "application/json";
        body = JSON.stringify(body);
      }
      console.log("JSON INPUT BODY", body);
      const response = await fetch(`${baseUrl}${path}`, {
        method: "POST",
        headers: headers,
        body: body,
      });
      return await response.json();
    } catch (error) {
      console.error("Error in POST request:", error);
      throw error;
    }
  },
  // put: async (path, body) => {
  //   try {
  //     const response = await fetch(`${baseUrl}${path}`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "ngrok-skip-browser-warning": "69420",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify(body),
  //     });
  //     return await response.json();
  //   } catch (error) {
  //     console.error("Error in PUT request:", error);
  //     throw error;
  //   }
  // },
  put: async (path, body, isFormData = false) => {
    try {
      const headers = {
        "ngrok-skip-browser-warning": "69420",
        Authorization: `Bearer ${token}`,
      };

      if (!isFormData) {
        headers["Content-Type"] = "application/json";
        body = JSON.stringify(body);
      }
      console.log("JSON INPUT BODY", body);
      const response = await fetch(`${baseUrl}${path}`, {
        method: "PUT",
        headers: headers,
        body: body,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        return await response.json();
      } else {
        console.error("Expected JSON response but received:", contentType);
        return null; // Hoặc xử lý theo cách khác nếu không phải JSON
      }
    } catch (error) {
      console.error("Error in PUT request:", error);
      throw error;
    }
  },
  delete: async (path, params) => {
    const url = new URL(`${baseUrl}${path}`);
    url.search = new URLSearchParams(params).toString();

    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "ngrok-skip-browser-warning": "69420",
          Authorization: `Bearer ${token}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error("Error in DELETE request:", error);
      throw error;
    }
  },
};

export default commonAPI;

// Sử dụng

// import commonAPI from "./commonAPI";

const fetchData = async () => {
  try {
    const params = { key1: "value1", key2: "value2" };
    const data = await commonAPI.get("/path/to/resource", params);
    console.log("GET response data:", data);
  } catch (error) {
    console.error("Error fetching data with GET:", error);
  }
};

fetchData();

// import commonAPI from "./commonAPI";

const postData = async () => {
  try {
    const body = { key1: "value1", key2: "value2" };
    const data = await commonAPI.post("/path/to/resource", body);
    console.log("POST response data:", data);
  } catch (error) {
    console.error("Error posting data with POST:", error);
  }
};

postData();

// import commonAPI from "./commonAPI";

const updateData = async () => {
  try {
    const body = { key1: "updatedValue1", key2: "updatedValue2" };
    const data = await commonAPI.put("/path/to/resource", body);
    console.log("PUT response data:", data);
  } catch (error) {
    console.error("Error updating data with PUT:", error);
  }
};

updateData();

// import commonAPI from "./commonAPI";

const deleteData = async () => {
  try {
    const params = { key1: "value1", key2: "value2" };
    const data = await commonAPI.delete("/path/to/resource", params);
    console.log("DELETE response data:", data);
  } catch (error) {
    console.error("Error deleting data with DELETE:", error);
  }
};

deleteData();
