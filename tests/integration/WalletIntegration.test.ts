import { WalletService } from "../../src/services/WalletService";

describe("WalletService - Integration & Test Doubles", () => {
  test("Deve acionar o Mock de Antifraude durante a transferência", async () => {
    // Arrange: Configurando Mock de saída
    const antiFraudMock = {
      verify: jest.fn().mockResolvedValue(true)
    };
    
    // Arrange: Stub de dados de câmbio / validação cadastral fixa
    const cadastralStub = { getStatus: () => ({ active: true, country: "BR" }) };

    const service = new WalletService(antiFraudMock);
    service.createAccount("acc-A", 500);
    service.createAccount("acc-B", 100);

    // Act
    const status = cadastralStub.getStatus();
    expect(status.active).toBe(true);

    await service.transfer("tx-int-1", "acc-A", "acc-B", 200);

    // Assert: Verifica se o Mock foi chamado exatamente 1 vez com os parâmetros corretos
    expect(antiFraudMock.verify).toHaveBeenCalledTimes(1);
    expect(antiFraudMock.verify).toHaveBeenCalledWith("acc-A", 200);
  });
});