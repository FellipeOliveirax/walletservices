import request from "supertest";
// Supondo que você exporte o app Express configurado em src/app.ts
import { app } from "../../src/app"; 

describe("E2E Wallet API Flow", () => {
  test("Fluxo completo: Criar contas, transferir e validar saldos", async () => {
    // 1. Criar conta origem
    const res1 = await request(app)
      .post("/accounts")
      .send({ id: "acc-1", initialBalance: 300 });
    expect(res1.status).toBe(201);

    // 2. Criar conta destino
    await request(app)
      .post("/accounts")
      .send({ id: "acc-2", initialBalance: 100 });

    // 3. Realizar transferência
    const transferRes = await request(app)
      .post("/transfers")
      .send({ transactionId: "t-e2e-1", sourceId: "acc-1", targetId: "acc-2", amount: 150 });
    expect(transferRes.status).toBe(200);

    // 4. Consultar saldo final
    const balanceRes = await request(app).get("/accounts/acc-1");
    expect(balanceRes.body.balance).toBe(150);
  });
});