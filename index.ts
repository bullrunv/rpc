import { ApiPromise, WsProvider } from '@polkadot/api';

async function main() {
  // Connect to a Substrate node
  const wsProvider = new WsProvider('wss://rpc.polkadot.io');
  const api = await ApiPromise.create({ provider: wsProvider });

  // Get the latest block number
  const latestBlock = await api.rpc.chain.getHeader();
  console.log(`Latest block: #${latestBlock.number}`);

  // Subscribe to new blocks
  api.rpc.chain.subscribeNewHeads((lastHeader) => {
    console.log(`New block: #${lastHeader.number}`);
  });

  // Subscribe to system events
  api.query.system.events((events) => {
    console.log(`\nReceived ${events.length} events:`);
    events.forEach((record) => {
      const { event, phase } = record;
      console.log(`\tPhase: ${phase}: ${event.section}.${event.method}:: (data: ${event.data.toString()})`);
    });
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
