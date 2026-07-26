import { Router } from 'express';
import { getNetworkConfig, getContractAddress } from '../midnight/client.js';

const router = Router();

router.get('/', (req, res) => {
  const config = getNetworkConfig();
  const address = getContractAddress();
  
  res.json({
    network: config,
    contractAddress: address
  });
});

export default router;
