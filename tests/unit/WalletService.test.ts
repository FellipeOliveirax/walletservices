import { WalletService } from "../../src/services/WalletService";

describe("WalletService - Unit Tests (TDD)", () => {
  let service: WalletService;
  const mockAntiFraud = { verify: jest.fn().mockResolvedValue(true) };

  beforeEach(() => {
    service = new WalletService(mockAntiFraud);
  });

  test("Deve criar uma conta com saldo inicial válido", () => {
    const acc = service.createAccount("1", 100);
    expect(acc).toEqual({ id: "1", balance: 100 });
  });

  test("Não deve permitir saldo inicial negativo", () => {
    expect(() => service.createAccount("2", -50)).toThrow("O saldo inicial não pode ser negativo.");
  });

  test("Deve realizar transferência com sucesso entre contas", async () => {
    service.createAccount("1", 200);
    service.createAccount("2", 50);

    await service.transfer("tx-1", "1", "2", 100);

    expect(service.getAccount("1")?.balance).toBe(100);
    expect(service.getAccount("2")?.balance).toBe(150);
  });

  test("Deve barrar transferência por saldo insuficiente", async () => {
    service.createAccount("1", 50);
    service.createAccount("2", 50);

    await expect(service.transfer("tx-2", "1", "2", 100)).rejects.toThrow("Saldo insuficiente.");
  });
});