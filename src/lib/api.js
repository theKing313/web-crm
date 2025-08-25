import ky from "ky";
import Cookies from "js-cookie";

export const api = ky.create({
  // "/api" ||
  prefixUrl: "http://localhost:3001/api",
  // prefixUrl: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  hooks: {
    beforeRequest: [
      (request) => {
        const token = Cookies.get("token");
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status === 401) {
          Cookies.remove("token");
          window.location.href = "/login";
        }
      },
    ],
  },
});
