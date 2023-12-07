const CERT_BASE = `${process.env.HOME}/tmp/localhost-certs`;

export default {

  service: {
    dbUrl:  "mongodb+srv://dev_rose:Atieno_20@raocluster.oautq.mongodb.net/sensors",
  },

  ws: {
    port: 2345,
    base: '/sensors-info',
  },

  https: {
    certPath: `${CERT_BASE}/localhost.crt`,
    keyPath: `${CERT_BASE}/localhost.key`,
  },
  

};
