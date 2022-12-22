import { Router } from "@vaadin/router";
import { state } from "../../state";
export function formComponent() {
   class FormComp extends HTMLElement{
      shadow = this.attachShadow({ mode: "open" });
      /* roomExistente: boolean = false; */
      constructor() {
         super();
         this.render();

      }
      addListener() {
         
      const divTrue = this.shadow.querySelector(".container-room-true")!;
         
         const roomTrue = this.shadow.querySelector(".select") as any; 
            
            roomTrue?.addEventListener("change", (e) => {
            const target = e.target as any
            
            if (target.value === "1") {
               /* this.roomExistente = false; */
               
               divTrue.innerHTML = ``;

         };
         if (target.value === "2") {
            /* this.roomExistente = true; */
            divTrue.innerHTML = `
            <div class="container-room-existente">
               <label class="subtitle-room-existente">Room ID</label>
               <input class="input-room-existente" type="text" name="id"/>
            </div>
            `;

         };
            });
         
         const formEl = this.shadow.querySelector(".container-form");
      
         formEl?.addEventListener("submit", (e) => {
            e.preventDefault()
            const inputEmail = this.shadow.querySelector(".input-email") as any;
            const valueEmail = inputEmail.value;

            const inputName = this.shadow.querySelector(".input-name") as any;
            const valueName = inputName.value;


            const optionValue = roomTrue.value;
            //SI ELIJE LA OPCION 1, QUE ES "NUEVO ROOM".
            //HACE LO SIGUIENTE..
            if (optionValue === "1") {
            //con trim() le quito todo los espacios en blanco que tenga el campo de texto
            //acá verifico que si uno de los dos esta vacio .. que lance una alerta
            if (valueEmail.trim() === "" || valueName.trim() === "") {
               alert("debes llenar los campos");
            }
            //aca de lo contrario, si es lo contrario a vacio, que setee el email y name
            if (valueEmail.trim() !== "" && valueName.trim() !== "") {

               state.setEmailAndFullname(valueEmail, valueName)
               
               const newUser = {
                  name: valueName,
                  email: valueEmail
               }
               const userPromise = state.createUser(newUser);

               userPromise.then((res) => {
               //si en el backend evalua que ya exite, lanza el error que está puesto en message
            if (res.message) {
               return alert(res.message)
            }
            //si se crea correctamente el usuario
            //se crea un room con su id
            if (res.id) {
               const userId = {
                  userId: res.id
               };
               /* console.log("soy userId",userId); */
               
               const newRoom = state.createRoom(userId);
               const newUserId = res.id;
               /* console.log("soy id largo",newUserId); */
               

               newRoom.then((res) => {
                  //en res esta el roomid (los numeros)
                  //SI EXISTE UN ID ROOM CORTO LO SETEO
                  if (res.id) {
                  //ROOM ID CORTO
                  const newRoomId = res.id;
                  /* console.log("soy roomiD",newRoomId); */

                  state.setRoomId(newRoomId);
                  
               //ADQUIRIR ID LARGO PARA ACCEDER A LA ROOM
               const getRoom = state.accessToRoom(newRoomId, newUserId);
                     getRoom.then((res) => {
                        //SETEO EL ROOMLONGID EN EL STATE
                        state.setRoomLongId(res.rtdbRoomId);
                        //ESCUCHO EL ROOMLONGID PARA ACCEDER A ESE ROOM
                        state.listenRoom(res.rtdbRoomId);
                        Router.go("/chat")
                     });
               };
            });
         }
      });
   } 
} 
      //SI ELIGE LA OPCION DOS, DE ROOM EXISTENTE
      //HARÁ LO SIGUIENTE..
      if (optionValue == "2") {
         //con trim() le quito todo los espacios en blanco que tenga
         //acá verifico que si uno de los dos esta vacio .. que lance una alerta
         if (valueEmail.trim() === "" || valueName.trim() === "") {
            alert("debe llenar los campos");
         }
         //aca de lo contrario, si es lo contrario a vacio, que setee el email y name
         if (valueEmail.trim() !== "" && valueName.trim() !== "") {
            state.setEmailAndFullname(valueEmail, valueName);

            const target = e.target as any;
            //aqui accedo lo que me da en el input de room id con e.target.ID
            //ese ID que tiene target es el id que esta en el input name='id', donde obtengo el input
            const inputIdRoom = target.id.value;
            if (inputIdRoom === "") {
               alert("ingresa el room id");
            }
            const emailData = { email: valueEmail };
            //aca verifico si el email es valido
            const getAuthEmail = state.emailAuth(emailData);

            getAuthEmail.then((res) => {
               if (res.message) {
                  alert(res.message);
               }
               if (res.id) {
                  //aca guardo el userId largo
                  const userAuthId = res.id;
                  console.log("userauth",userAuthId);
                  
                  //seteo el id que me pasaron en el input de room id;
                  state.setRoomId(inputIdRoom);
                  console.log("inputidroom",inputIdRoom);
                  
                  

                  const getRoomThen = state.accessToRoom(inputIdRoom, userAuthId);
                  getRoomThen.then((res) => {
                     /* console.log("soy res acccessroom",res); */
                     
                     if (res.message) {
                        //aca dispara que el room no existe
                        alert(res.message);
                     }
                     if (res.rtdbRoomId) {
                         //SETEO EL ROOMLONGID EN EL STATE
                        state.setRoomLongId(res.rtdbRoomId);
                         //ESCUCHO EL ROOMLONGID PARA ACCEDER A ESE ROOM
                        state.listenRoom(res.rtdbRoomId);
                        Router.go("/chat")
                     }
                  })
               }
            });
         };

      }
      
   });
   };
      render() {
         const style = document.createElement("style");

         style.textContent = `
         
         .container-form{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 30px;
         }

         .container-email-input,
         .container-name,
         .container-select,
         .container-room-existente{
            display:flex;
            justify-content:center;
            flex-direction:column
         }
         
         .container-room-existente{
            height:64px;
         }
         
         .subtitle-email{
            font-size: 24px;
         }

         .input-email,
         .input-name,
         .input-room-existente{
            width:312px;
            height:44px;
            border-right-style: none;
            border-left-style: none;
            border-top-style: none;
            border-bottom-color: black;
            background: none;
            font-size: 21px;
            color: #414141;
         }
         .input-email:focus,
         .input-name:focus,
         .input-room-existente:focus{
            outline:none;
            border-bottom-color: #ffffff;
            transition:0.5s;
         }

         .subtitle-name{
            font-size: 24px;
         }

         .select{
            width: 332px;
            height: 44px;
            font-size: 18px;
            border-right-style: none;
            border-left-style: none;
            border-top-style: none;
            border-bottom-style: none;
            background-color: #000000;
            color: #ffffff;
            border-radius: 11px;
         }

         .subtitle-select{
            font-size: 24px;
            margin: 2px;
         }
         .new-room,
         .room-existente{
            text-align: center;
         }
         .prueba{
            background-color: aqua;
         }

         .subtitle-room-existente{
            font-size:24px;
         }
         .button-container{
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 20px;
         }
         .button{
            width:335px;
            height:55px;
            border-style: none;
            border-radius: 9px;
            font-size: 20px;
            background: black;
            color: white;
         }
         `;

         this.shadow.innerHTML = `  
         <form class="container-form">
            <div class="container-email-input">
               <label class="subtitle-email">Email</label>
               <input class="input-email" name="nombre" type="email"/>
            </div>

            <div class="container-name">
               <label class="subtitle-name">Tu nombre</label>
               <input class="input-name" name="nombre" type="text"/>
            </div>

            <div class="container-select">
               <label class="subtitle-select">Room</label>
               <select class="select">
                  <option value="1" class="new-room">Nuevo room</option>
                  <option value="2" class="room-existente">Room existente</option>
               </select>
            </div>

            <div class="container-room-true"></div>

            <div class="button-container">
               <button class="button">Comenzar</button>
            </div>
         </form>

         `;

   

         this.shadow.appendChild(style);
         this.addListener();
      };
   };
   customElements.define("form-component", FormComp);
};