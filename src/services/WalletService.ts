export interface Account {
  id: string;
  balance: number;
}

export interface Transaction {
  id: string;
  sourceAccountId: string;
  targetAccountId: string;
  amount: number;
  timestamp: Date;
}

export class WalletService {
  private accounts: Map<string, Account> = new Map();
  private processedTransactions: Set<string> = new Set();

  constructor(private antiFraudService: { verify: (id: string, amount: number) => Promise<boolean> }) {}

  public createAccount(id: string, initialBalance: number): Account {
    if (initialBalance < 0) throw new Error("O saldo inicial não pode ser negativo.");
    if (this.accounts.has(id)) throw new Error("Conta já existe.");
    const account = { id, balance: initialBalance };
    this.accounts.set(id, account);
    return account;
  }

  public getAccount(id: string): Account | undefined {
    return this.accounts.get(id);
  }

  public async transfer(transactionId: string, sourceId: string, targetId: string, amount: number): Promise<void> {
    if (amount <= 0) throw new Error("O valor da transferência deve ser maior que zero.");
    if (this.processedTransactions.has(transactionId)) return; // Idempotência

    const source = this.accounts.get(sourceId);
    const target = this.accounts.get(targetId);

    if (!source || !target) throw new Error("Conta de origem ou destino não encontrada.");
    if (source.balance < amount) throw new Error("Saldo insuficiente.");

    // Chamada ao serviço externo de antifraude (Mock/Stub)
    const isApproved = await this.antiFraudService.verify(sourceId, amount);
    if (!isApproved) throw new Error("Transação rejeitada pelo sistema antifraude.");

    source.balance -= amount;
    target.balance += amount;
    this.processedTransactions.add(transactionId);
  }
}