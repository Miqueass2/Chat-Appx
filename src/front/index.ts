import { state } from "./state";
/* COMPONENTSS */
import { formComponent } from "./components/form";
/* PAGES */
import "./pages/home/index";
import "./pages/chat/index";
import "./router";

(function () { 
   formComponent();
   state.init();
})();