declare global {
  interface Window {
    Ipfs: any;
  }
}
let _ipfs: any = null;
export default async function getFilesystem(): Promise<any> {
  return new Promise((resolve, reject) => {
    if (_ipfs) {
      return resolve(_ipfs);
    }

    const ipfs = new window.Ipfs({
      repo: "/local/database",
      start: true,
      preload: {
        enabled: true
      },
      EXPERIMENTAL: {
        pubsub: true
      },
      config: {
        Addresses: {
          Swarm: [
            // Use IPFS dev signal server
            // '/dns4/star-signal.cloud.ipfs.team/wss/p2p-webrtc-star',
            "/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star"
            // Use local signal server
            // '/ip4/0.0.0.0/tcp/9090/wss/p2p-webrtc-star',
          ]
        }
      }
    });
    ipfs.on("init", () => console.log("inicializando nó"));
    ipfs.on("start", () => console.log("começando conexão"));
    ipfs.on("stop", () => console.log("parando conexão"));

    ipfs.on("error", (err: Error) => {
      console.log("erro no nó", err.message);
      reject(err);
    });
    ipfs.on("ready", () => {
      _ipfs = ipfs;
      console.log("nó preparado");
      resolve(_ipfs);
    });
  });
}
