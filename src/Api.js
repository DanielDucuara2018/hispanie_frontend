import axios from 'axios';

export default axios.create({
  baseURL: "http://localhost:3201/api/v1/"
});