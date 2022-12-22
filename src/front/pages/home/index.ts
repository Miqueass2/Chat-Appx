class Home extends HTMLElement {
   shadow: ShadowRoot = this.attachShadow({ mode: "open" });
   connectedCallback() {
      this.render();
      
   }
   render() {
      const style = document.createElement("style");
      style.textContent = `  
      .title-welcome{
         display: flex;
         justify-content: center;
         font-size: 52px;
         margin: 29px;
      }
      .button-container{
         display: flex;
         justify-content: center;
         align-items: center;
      }
      ` ;
      

      this.shadow.innerHTML = `  
      <h1 class="title-welcome">Bienvenidx</h1>

      <form-component class="form-component"></form-component>

      `;
   
      this.shadow.appendChild(style)
   }
}
   customElements.define("home-page", Home);

