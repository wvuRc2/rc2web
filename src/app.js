import 'bootstrap';
import 'bootstrap/css/bootstrap.css!';

export class App {
  configureRouter(config, router){
  console.log("configuring router");
    config.title = 'Rc²;';
    config.map([
      { route: ['','welcome'],  name: 'welcome',      moduleId: 'welcome',      nav: true, title:'Welcome' },
      { route: 'login',         name: 'login',        moduleId: 'login',        nav: true, title:'Login' },
      { route: 'wspaces',         name: 'wspaces',        moduleId: 'wspaces',        nav: true, title:'Workspaces', auth:false }
    ]);

    this.router = router;
  }
}
