// (async () => {
//     const rawResponse = await fetch('https://httpbin.org/post', {
//       method: 'POST',
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({a: 1, b: 'Textual content'})
//     });
//     const content = await rawResponse.json();
  
//     console.log(content);
//   })();

export default async function fetcher(url: string, fetchopt:RequestInit) {
    try {
      const response = await fetch(url, fetchopt)
  
      // if the server replies, there's always some data in json
      // if there's a network error, it will throw at the previous line
      const data = await response.json()
  
      if (response.ok) {
        return data
      }
  
      const error = new Error(response.statusText)
      const obj={response, data}
      const errorTarget = Object.assign(error, obj)
      throw errorTarget
    } catch (error) {
      if (!error.data) {
        error.data = { message: error.message }
      }
      throw error
    }
  }