class ApiFactory {
  constructor() {
    this.apiUrl = "http://"+import.meta.env.VITE_API_HOST+":"+import.meta.env.VITE_API_PORT;
    this.apiSecret = import.meta.env.VITE_API_SECRET;
    const myHeaders = new Headers();
    myHeaders.append("x-api-key", import.meta.env.VITE_API_SECRET);
    myHeaders.append("Content-Type", "application/json");
    this.myHeaders = myHeaders;
  }

  getHomes(args) {
    args.response_format = "geojson";

    const requestOptions = {
      method: "POST",
      headers: this.myHeaders,
      body: JSON.stringify(args),
      redirect: "follow"
    };

    return fetch(this.apiUrl+"/homes", requestOptions).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json(); // Converti la response in JSON
    });
  }

}

const apiFactory = new ApiFactory();
export default apiFactory;
