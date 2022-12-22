import { rtdb } from "./rtdb";
import map from "lodash/map";
const API_BASE_URL = "http://localhost:1200";


const state = {
   data: {
      email: "",
      fullName: "",
      userId: "",
      roomId: "",
      messages: []
      },
   listeners: [],
   // OBTENEMOS EL STATE CON getState()
   //CON EL INIT() OBTENEMOS LOS DATOS DE LA RTDB Y LO PASAMOS AL STATE, 
   //Y DESDE LOS COMPONENTES O PAGES PODEMOS MANIPULAR LOS DATOS GRACIAS AL STATE
   init() {
      const localStorageState = localStorage.getItem("state");

   },
   listenRoom(rtdbRoomId) {
      /* console.log("soy rtdbroomId listenroom",rtdbRoomId); */
      
      const cs = this.getState();
      const chatRoomsRef = rtdb.ref("/rooms/" + rtdbRoomId);
      chatRoomsRef.on("value", (snapshot) => {
         
         const messagesFromServer = snapshot.val();
         
         /* console.log("messages",messagesFromServer); */
         
         const messageList = map(messagesFromServer.messages)
         
         cs.messages = messageList; 
         
         this.setState(cs);
      }); 
   },
   getState() {
      return this.data;
   },
   setEmailAndFullname(email:string,name:string) {
      const cs = this.getState();
      cs.fullName = name;
      cs.email = email;
      this.setState(cs);
   },
   createUser(newUser) {
      return fetch(API_BASE_URL + "/signup", {
         method: "post",
         headers: { "content-type": "application/json" },
         body: JSON.stringify(newUser)
      })
      .then(res => res.json())
         .then(data => {
            /* console.log("soy data",data); */
            return data
         })
      
   },
   createRoom(userId) {
      return fetch(API_BASE_URL + "/rooms", {
         method: "post",
         headers: { "content-type": "application/json" },
         body: JSON.stringify(userId),
      })
         .then((res) => {
            return res.json();
         })
         .then((finalres) => {
         //LE MANDAMOS EL ID CORTO A /ROOMS Y
         //ACA RESPONDE EL ID CORTO DESDE EL BACKEND
         return finalres;
      });
   },
   setRoomId(roomId:string) {
      const currentState = this.getState();
      currentState.roomId = roomId;
      this.setState(currentState);
   },
   setRoomLongId(userId: string) {
      const currentState = this.getState();
      currentState.userId = userId;
      this.setState(currentState);
   },
   emailAuth(email) {
      return fetch(API_BASE_URL + "/auth", {
         method: "post",
         headers: {
            "content-type": "application/json",
         },
         body: JSON.stringify(email)
      }).then((res) => {
         return res.json()
      }).then((data) => {

         console.log("soy data",data);
         return data;
      });
      
   },
   accessToRoom(roomId,userId) { 
         /* SIN DECIRLE EL METHOD, POR DEFECTO EL METHOD ES GET
         NO NECESITAMOS EL HEADER YA QUE NO ENVIAMOS NINGUN BODY
          */
      return fetch(API_BASE_URL + "/rooms/" + roomId + "?userId=" + userId)
         .then((res) => {
            return res.json();
         })
         .then((data) => {
            //NOS DEVUELVE EN DATA DEL RTDB ID nanoid 
            /* console.log("soy data accesroom.rtd", data.rtdbRoomId); */
            
            return data;
         });
      },
   setMessage(message: string) {
      const cs = this.getState();
      const csRoomLongId = cs.userId;
      const nameOfState = this.data.fullName;

      fetch(API_BASE_URL + "/rooms/" + csRoomLongId, {
         method: "post",
         headers: {
            "content-type": "application/json"
         },
         body: JSON.stringify({
            from: nameOfState,
            message: message
         })
      });
      
   },
   // LE ASIGNAMOS UN NUEVO VALOR CON  setState(valor)

   setState(newState) {
      this.data = newState;
      for (const cb of this.listeners) {
         cb();
         
      }
      localStorage.setItem("state",JSON.stringify(newState))
      console.log("Im the State, I change", this.data);
   },
   // CON EL SUBSCRIBE ES COMO UN EVENTO, ESCUCHAMOS LOS CAMBIOS Y LO GUARDAMOS EN EL LISTENER
   subscribe(callback: (any) => any) {
      //callback si o si debe pasar una funcion como parámetro
      this.listeners.push(callback);
      
   }
}

export { state };