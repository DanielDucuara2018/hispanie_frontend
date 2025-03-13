import axios from 'axios';

export default axios.create({
  baseURL: "https://api.hispanie.com/api/v1"
});