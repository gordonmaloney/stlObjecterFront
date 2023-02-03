//fetch all applications
const getApplications = async () => {
  const response = await fetch("https://stls-craper-gordonmaloney.vercel.app/read/");

  const data = await response.json();

  return data.data;
};

const service = {
  getApplications,
};

export default service;
