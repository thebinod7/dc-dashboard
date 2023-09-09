// const host_url = "https://server.devcolumn.com";
const HOST_URL = process.env.REACT_APP_API_SERVER;

const BASE_URL = HOST_URL + "/api/v1";

module.exports = {
  ARTICLES: BASE_URL + "/articles",
  CATEGORY: BASE_URL + "/category",
  CATEGORY_ALL: BASE_URL + "/category/all",
  CHANGE_PASSWORD: BASE_URL + "/users/change-password",
  ME: BASE_URL + "/users/me",
  PROFILE: BASE_URL + "/users/profile",
  REPORTS: BASE_URL + "/reports",
  UPLOAD_AVATAR: BASE_URL + "/users/upload-avatar",
  USERS: BASE_URL + "/users",
  USER_LOGIN: BASE_URL + "/users/login",
};
