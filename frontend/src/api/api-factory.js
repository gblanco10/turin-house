// import { config } from '../config';

class ApiFactory {
  constructor() {
    this.apiUrl = "localhost:30080"; // URL del backend
    this.apiSecret = "development"; // Secret per l'autenticazione
    this.headers = {
      'Content-Type': 'application/json',
      'x-api-key': 'development',
    };
    const myHeaders = new Headers();
    myHeaders.append("x-api-key", "development");
    myHeaders.append("Content-Type", "application/json");
    this.myHeaders = myHeaders;
  }

  // Metodo per ottenere le "homes" dal backend
  getHomes(args) {
    args.response_format = "geojson";

    const requestOptions = {
      method: "POST",
      headers: this.myHeaders,
      body: JSON.stringify(args),
      redirect: "follow"
    };

    return fetch("http://localhost:30080/homes", requestOptions).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json(); // Converti la response in JSON
    });
  }

  //   // Metodo per ottenere le "routes" dal backend
  //   getRoutes() {
  //     try {
  //       const response = await fetch(`${this.apiUrl}/routes`, {
  //         method: 'GET',
  //         headers: {
  //           'Authorization': `Bearer ${this.apiSecret}`,
  //         },
  //       });

  //       if (!response.ok) {
  //         throw new Error('Failed to fetch routes data');
  //       }

  //       const data = await response.json();
  //       return data; // Restituiamo i dati ricevuti
  //     } catch (error) {
  //       throw error; // Rilancia l'errore per essere gestito dal chiamante
  //     }
  //   }
}

// Esportiamo l'istanza di ApiFactory
const apiFactory = new ApiFactory();
export default apiFactory;
