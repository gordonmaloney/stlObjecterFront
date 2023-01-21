//fetch all applications
const getApplications = async () => {
  const response = await fetch("https://stlfetcher.onrender.com/read/");

  const data = await response.json();

  return data.data;
};

const service = {
  getApplications,
};

export default service;
