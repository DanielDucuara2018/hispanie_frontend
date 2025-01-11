import axios from 'axios';

export default axios.create({
  baseURL: "http://api.hispanie.com/api/v1"
});