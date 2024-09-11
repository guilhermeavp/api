import Consul from 'consul';
import { discoveryRoutes } from '../routes/api.router';

export let servicos = [];
export const urls = new Map<string, string>();

const consul = new Consul({
  //host:'127.0.0.1'
  host:'127.0.0.1@consul1'
});

export const initConsul = async () => {
  // Configura os serviços e escuta por mudanças no Consul
  const catalog = Object.keys(await consul.catalog.services());
  servicos = catalog;
  if(servicos.length && servicos !== catalog){
    const newService = [];
    catalog.forEach(e => {
      if(servicos.find(el => e === el)) newService.push(e);
      });
    discoveryRoutes(newService);
  }

  for (const servico of catalog) {
    consul.watch({
      method: consul.health.service,
      options: ({
        service: servico,
        passing: true
      } as any)
    }).on('change', (nodos) => {
      urls.set(servico, nodos.map(n => `http://${n.Service.Address}:${n.Service.Port}/api`)[0]);
    }).on('error', e => console.error(e));
  }
/*   setTimeout(() => {
    initConsul();
  }, 1000000); */
};
