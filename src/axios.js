import axios from "axios";

const instance = axios.create({
  baseURL: "https://lightpink-mantis-558571.hostingersite.com/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "System-key": "FD995E9A62F97A01",
  },
});

export default instance;
