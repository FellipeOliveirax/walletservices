import express, { Request, Response } from 'express';
import { WalletService } from './services/WalletService';

export const app = express();
app.use(express.json());

// Simulação de serviço antifraude externo (Mock/Stub simples)
const antiFraudService = {
  verify: async (_accountId: string, _amount: number): Promise<boolean> => {
    return true; // Sempre aprova por padrão nos testes
  }
};

const walletService = new WalletService(antiFraudService);

// 1. Criar Conta
app.post('/accounts', (req: Request, res: Response): any => {
  try {
    const { id, initialBalance } = req.body;
    const account = walletService.createAccount(id, initialBalance);
    return res.status(201).json(account);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// 2. Consultar Conta
app.get('/accounts/:id', (req: Request, res: Response): any => {
  const account = walletService.getAccount(req.params.id);
  if (!account) {
    return res.status(404).json({ error: 'Conta não encontrada' });
  }
  return res.status(200).json(account);
});

// 3. Realizar Transferência
app.post('/transfers', async (req: Request, res: Response): Promise<any> => {
  try {
    const { transactionId, sourceId, targetId, amount } = req.body;
    await walletService.transfer(transactionId, sourceId, targetId, amount);
    return res.status(200).json({ message: 'Transferência realizada com sucesso' });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});