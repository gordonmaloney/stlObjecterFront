//fetch all applications
const getApplications = async () => {
  const response = await fetch("/applications.json");

  const data = await response.json();

  return data.map(app => {
    return {
      ...app,
      slug: app.refNo.replaceAll('/', '-')
    }
  });
};

const service = {
  getApplications,
};

export default service;
