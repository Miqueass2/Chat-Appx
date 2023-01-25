import { state } from "../../state";
type Message = {
   from: string;
   message: string;
};
class ChatPage extends HTMLElement{
   shadow: ShadowRoot = this.attachShadow({ mode: "open" });
   messages: Message[] = [];
   connectedCallback() {
      state.subscribe(() => {
         //con el state.subscribe lo que hago es setear los ultimos mensajes que se mandaron
         //a this.messages
         const currentState = state.getState();
         this.messages = currentState.messages;
         
         // BORRA EL CHATROOM ANTERIOR Y RENDERIZA UNO NUEVO
         this.shadow.lastChild?.remove();
         this.render();
         
      });
       //tragio los msjs que quedaron y los pongo en la page /chat
      const currentState = state.getState();
      this.messages = currentState.messages;
      this.render();
   }

   //listener para submit
   addListeners() {
      const formEl = this.shadow.querySelector(".form-container");
      formEl?.addEventListener("submit", (e) => {
         e.preventDefault();
         const target = e.target as any;
         const valueMessage = target.message.value;
         /* console.log(valueMessage); */

         if (valueMessage !== "") {
            state.setMessage(valueMessage)
         } else {
            alert("no puedes enviar mensajes vacios")
         }
         
      });
   }
   render() {
      const style = document.createElement("style");
      style.textContent = ` 
         .parrafos-container{
            display: flex;
            flex-direction: column;
            margin: 0 44px;
            align-items: center;
            position: relative;
            left: -116px;
         }

         .title{
            font-size: 50px;
            margin: 30px 0 0 0;
         }
         .room-id{
            font-size: 20px;
            margin: 0;
         }
         .form-container{
            display: flex;
            gap:20px;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin-bottom: 10px;
         }
         .send-message-input{
            width: 320px;
            height: 40px;
            border: solid 2px;
            border-radius: 6px;
            font-size: 16px;
         }
         .button{
            width: 327px;
            height: 45px;
            font-size: 20px;
            border-radius: 6px;
            background: black;
            color: white;
            border-style: none;
         }
         .container-chat-messages{
            display: flex;
            flex-direction: column;
            height: 350px;
            background-color: aquamarine;
            padding: 10px;
            margin: 20px;
            border-radius: 6px;
            overflow-y:scroll;
            width:320px;
         }
         
         .container-messages{
            display: flex;
            flex-direction: column;
            align-items: center;
         }

         .user-1{
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            margin-right: 10px;
         }
         .user-name{
            font-size: 17px;
            margin: 3px;
            color: #433434;
         }
         .user-message{
            margin: 0;
            padding: 10px;
            background-color: #c9c9c9;
            color: black;
            border-radius: 5px;
            font-size: 18px;
         }
         .user-2{
            display: flex;
            flex-direction: column;
            align-items: flex-start;
         }
         .user-name-2{
            font-size: 17px;
            margin: 3px;
            color: #433434;
         }
         .user-message-2{
            margin: 0;
            padding: 10px;
            background-color: #acd5f2;
            color: black;
            border-radius: 5px;
            font-size: 18px;
         }

         @media (min-width:768px){
            .parrafos-container{
               left:-266px;
            }
         }

         @media (min-width:768px){
            .container-chat-messages{
               width:650px;
            }
      `;

      const roomId = state.getState().roomId; 
      this.shadow.innerHTML = ` 
      <div class="parrafos-container">
         <h1 class="title">Chat</h1>
         <h3 class="room-id">Room ID: ${roomId}</h3>
      </div>
      <div class="container-messages">
         <div class="container-chat-messages"></div> 
      </div>

      <form class="form-container">
         <input class="send-message-input" name="message" type="text">
         <button class="button">Enviar</button>
      </form>

      `;

      const divChatEl = this.shadow.querySelector(".container-chat-messages")!;
      const currentState = state.getState();

      for (const m of this.messages) {
         const chatName = m.from;
         const chatMessage = m.message;

         const individualChats = document.createElement("div");
         if (chatName === currentState.fullName) {
            individualChats.innerHTML = `
            <div class="user-1">
               <h3 class="user-name">${chatName}</h3>
               <p class="user-message">${chatMessage}</p>
            </div>
            `;
            divChatEl.appendChild(individualChats);
         }
         if (chatName !== currentState.fullName) {
            
            individualChats.innerHTML = `
            <div class="user-2">
               <h3 class="user-name-2">${chatName}</h3>
               <p class="user-message-2">${chatMessage}</p>
            </div>
            `;
            divChatEl.appendChild(individualChats);
         }
      }



      this.shadow.appendChild(style);
      //aca le decimos que el top sea lo mismo que el alto, entonces baja siempre.
      divChatEl.scrollTop = divChatEl.scrollHeight;

      this.addListeners();
   }
}
customElements.define("chat-page",ChatPage)