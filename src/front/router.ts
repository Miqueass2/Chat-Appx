import { Router } from '@vaadin/router';
import "./pages/home/index";
import "./pages/chat/index";

const router = new Router(document.querySelector('.root'));
router.setRoutes([
  {path: '/', component: 'home-page'},
  {path: '/chat', component: 'chat-page'}
]);